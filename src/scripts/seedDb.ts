import { mainnet, zora } from 'viem/chains';
import { reset } from 'drizzle-seed';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { collectionsTable, tokensTable } from '@/db/schema';
import tokens from '../../token-snapshot.json';

type NewCollection = typeof collectionsTable.$inferInsert;
// type NewToken = typeof tokensTable.$inferInsert;

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
	// @ts-expect-error - this is correct per docs, but throws a type error. investigate later.
	await reset(db, schema);
	await db.insert(collectionsTable).values(collections).onConflictDoNothing();
	await db.insert(tokensTable).values(tokens);
} catch (error) {
	console.error(error);
}
