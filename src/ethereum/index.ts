import { createPublicClient, http } from 'viem';
import { mainnet, zora } from 'viem/chains';

export const ethClient = createPublicClient({
	chain: mainnet,
	transport: http(),
});

export const zoraClient = createPublicClient({
	chain: zora,
	transport: http(),
});
