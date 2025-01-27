import { db } from '../db';
import { tokensTable } from '../db/schema';
import { ethClient, zoraClient } from '../ethereum';
import abi from '../ethereum/abi';

type Token = typeof tokensTable.$inferInsert;

const s1Contract = { address: '0x5908eb01497b5d8e53c339ea0186050d487c8d0c', abi } as const;
const s2Contract = { address: '0x5aBF0c04aB7196E2bDd19313B479baebd9F7791b', abi } as const;

console.log('Fetching token supply...');

const [s1Supply, s2Supply] = await Promise.all([
	ethClient.readContract({
		...s1Contract,
		functionName: 'nextTokenId',
	}),
	zoraClient.readContract({
		...s2Contract,
		functionName: 'nextTokenId',
	}),
]);

console.log(`Season 1: ${Number(s1Supply)} tokens`);
console.log(`Season 2: ${Number(s2Supply)} tokens`);

const s1Calls = Array.from({ length: Number(s1Supply) }, (_, i) => {
	return { ...s1Contract, functionName: 'uri', args: [BigInt(i)] };
});

const s1CallResults = await ethClient.multicall({
	contracts: s1Calls,
});

const s1Tokens: Token[] = s1CallResults.map((result, i) => {
	return {
		collectionId: 1,
		tokenId: i,
		uriHash: result.result?.toString().split('://')[1] ?? '',
	};
});

// console.log(s1Tokens);

for (const token of s1Tokens) {
	try {
		const uri = 'https://ipfs.io/ipfs/' + token.uriHash;
		const response = await fetch(uri);
		const data = await response.json();
		console.log(data);
		if (data.name) token.name = data.name;
		if (data.description) token.description = data.description;
		if (data.image) token.imageHash = data.image.split('://')[1];
	} catch (error) {
		console.error(error);
	}
}

await db.insert(tokensTable).values(s1Tokens).onConflictDoNothing();

const s2Calls = Array.from({ length: Number(s2Supply) }, (_, i) => {
	return { ...s2Contract, functionName: 'uri', args: [BigInt(i)] };
});

const s2CallResults = await zoraClient.multicall({
	contracts: s2Calls,
});

const s2Tokens: Token[] = s2CallResults.map((result, i) => {
	return {
		collectionId: 2,
		tokenId: i,
		uriHash: result.result?.toString().split('://')[1] ?? '',
	};
});

for (const token of s2Tokens) {
	try {
		const uri = 'https://ipfs.io/ipfs/' + token.uriHash;
		const response = await fetch(uri);
		const data = await response.json();
		console.log(data);
		if (data.name) token.name = data.name;
		if (data.description) token.description = data.description;
		if (data.image) token.imageHash = data.image.split('://')[1];
	} catch (error) {
		console.error(error);
	}
}

await db.insert(tokensTable).values(s2Tokens).onConflictDoNothing();
