import { base, mainnet, zora } from 'viem/chains';
import type { NewCollection } from '@/lib/types';
import { db } from '@/server/db';
import * as schema from '@/server/db/schema';
import tokens from '../../../token-snapshot.json';

const collections: NewCollection[] = [
	{
		id: 1,
		name: 'Design Everydays, Season 1',
		chainId: mainnet.id,
		contractAddress: '0x5908eb01497b5d8e53c339ea0186050d487c8d0c',
	},
	{
		id: 2,
		name: 'Design Everydays, Season 2',
		chainId: zora.id,
		contractAddress: '0x5aBF0c04aB7196E2bDd19313B479baebd9F7791b',
	},
	{
		id: 3,
		name: 'Design Everydays, Comic Stans',
		chainId: base.id,
		contractAddress: '0x0c3a11ce08c635d78a0cb521aae14b2a6eef9c09',
	},
	{
		id: 4,
		name: 'Design Everydays, Higher',
		chainId: base.id,
		contractAddress: '0xa1c856ac4e5d022dc7c0fcde6f7768d8b131222d',
	},
	{
		id: 5,
		name: 'Design Everydays, Based Everydays',
		chainId: base.id,
		contractAddress: '0x29b94d9086beab4a5015ff55deb1a1e24edd8108',
	},
];

try {
	await db.insert(schema.collectionsTable).values(collections).onConflictDoNothing();
	await db.insert(schema.tokensTable).values(tokens);
	console.log('Database seeded.');
} catch (error) {
	console.error(error);
}
