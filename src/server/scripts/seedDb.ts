import { mainnet, zora } from 'viem/chains';
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
];

try {
	await db.insert(schema.collectionsTable).values(collections).onConflictDoNothing();
	await db.insert(schema.tokensTable).values(tokens);
	console.log('Database seeded.');
} catch (error) {
	console.error(error);
}
