import { createPublicClient, http } from 'viem';
import { base, mainnet, zora } from 'viem/chains';

export const ethClient = createPublicClient({
	chain: mainnet,
	transport: http(),
});

export const zoraClient = createPublicClient({
	chain: zora,
	transport: http(),
});

export const baseClient = createPublicClient({
	chain: base,
	transport: http(),
});
