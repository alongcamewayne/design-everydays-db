import { getAddress } from 'viem';
import { desc, eq } from 'drizzle-orm';
import type { NewToken } from '@/lib/types';
import { ethClient, zoraClient } from '@/ethereum';
import abi from '@/ethereum/abi';
import { db } from '../db';
import { tokensTable } from '../db/schema';

const contracts = [
	{ client: ethClient, id: 1, address: '0x5908eb01497b5d8e53c339ea0186050d487c8d0c' },
	{ client: zoraClient, id: 2, address: '0x5aBF0c04aB7196E2bDd19313B479baebd9F7791b' },
].map((c) => ({ ...c, contract: { address: getAddress(c.address), abi } }));

console.log('Retrieving token supply...');

const supplies = await Promise.all(
	contracts.map(({ client, contract }) =>
		client.readContract({ ...contract, functionName: 'nextTokenId' })
	)
);

console.log(`Season 1: ${Number(supplies[0])} tokens`);
console.log(`Season 2: ${Number(supplies[1])} tokens`);

async function fetchNewTokens(contractInfo: (typeof contracts)[number], totalSupply: bigint) {
	const { client, id, contract } = contractInfo;

	// Get the most recent tokenId in the database
	const mostRecentToken =
		(
			await db.query.tokensTable.findFirst({
				columns: { tokenId: true },
				where: eq(tokensTable.collectionId, id),
				orderBy: desc(tokensTable.tokenId),
			})
		)?.tokenId ?? -1;

	// Only fetch new tokens
	if (mostRecentToken + 1 >= Number(totalSupply)) return [];

	const newTokenIds = Array.from(
		{ length: Number(totalSupply) - (mostRecentToken + 1) },
		(_, i) => i + mostRecentToken + 1
	);

	// Batch contract calls
	const contractCalls = newTokenIds.map((tokenId) => ({
		...contract,
		functionName: 'uri',
		args: [BigInt(tokenId)],
	}));

	const multicallResults = await client.multicall({ contracts: contractCalls });

	return multicallResults.map((result, i) => ({
		tokenId: newTokenIds[i],
		collectionId: id,
		collectionAddress: contract.address,
		uriHash: result.result?.toString().split('://')[1] ?? '',
	}));
}

// Fetch token URIs for both contracts
const [s1Tokens, s2Tokens] = await Promise.all(
	contracts.map((contract, i) => fetchNewTokens(contract, supplies[i]))
);

const allTokens: NewToken[] = [...s1Tokens, ...s2Tokens];

if (!allTokens.length) {
	console.log('No new tokens to fetch.');
	process.exit(0);
}

const fetchWithRetry = async (token: NewToken, retries = 3, delay = 500) => {
	const uri = `https://ipfs.io/ipfs/${token.uriHash}`;
	for (let attempt = 0; attempt <= retries; attempt++) {
		try {
			const response = await fetch(uri);

			if (!response.ok) {
				if (response.status === 429) {
					// Too many requests
					const retryAfter = response.headers.get('Retry-After');
					const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : delay * (attempt + 1);
					if (attempt > 0)
						console.warn(`Rate limited. Retrying in ${waitTime}ms (Attempt ${attempt + 1})...`);
					await new Promise((res) => setTimeout(res, waitTime));
					continue;
				}
				throw new Error(`HTTP Error ${response.status}`);
			}

			const data = await response.json();
			return {
				...token,
				name: data?.name ?? '',
				description: data?.description ?? '',
				imageHash: data?.image?.replace('ipfs://', '') ?? '',
			};
		} catch (error) {
			if (attempt > 0)
				console.error(
					`Error fetching metadata for token ${token.tokenId} (Attempt ${attempt + 1}):`,
					error
				);
			await new Promise((res) => setTimeout(res, delay * (attempt + 1))); // Exponential backoff
		}
	}
	return token; // Return original token if all retries fail
};

// Batch requests with limited concurrency
const fetchInBatches = async (tokens: NewToken[], batchSize = 10, delayBetweenBatches = 1000) => {
	const results = [];
	for (let i = 0; i < tokens.length; i += batchSize) {
		console.log(
			`Fetching batch ${Math.floor(i / batchSize) + 1} of ${Math.ceil(tokens.length / batchSize)}`
		);
		const batch = tokens.slice(i, i + batchSize);
		const batchResults = await Promise.all(batch.map((token) => fetchWithRetry(token)));
		results.push(...batchResults);
		await new Promise((res) => setTimeout(res, delayBetweenBatches)); // Prevents immediate next batch requests
	}
	return results;
};

console.log(`Retrieving metadata for ${allTokens.length} tokens with throttling...`);
const enrichedTokens = await fetchInBatches(allTokens, 50, 1000);

console.log(`Retrieved metadata for ${enrichedTokens.length} tokens.`);

// Save the token data
await Bun.write(
	`src/server/scripts/output/${Date.now()}-token-output.json`,
	JSON.stringify(enrichedTokens, null, 2)
);

console.log('Token data saved.');
