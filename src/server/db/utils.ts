'use server';

import { asc } from 'drizzle-orm';
import { db } from '@/server/db';
import { collectionsTable, tokensTable } from '@/server/db/schema';

type DataArray = {
	metadata: typeof collectionsTable.$inferSelect;
	tokens: (typeof tokensTable.$inferSelect)[];
}[];

export async function getData() {
	const data: DataArray = [];

	const [collections, tokens] = await Promise.all([
		db.query.collectionsTable.findMany({
			orderBy: asc(collectionsTable.id),
		}),
		db.query.tokensTable.findMany({
			orderBy: asc(tokensTable.tokenId),
		}),
	]);

	for (const collection of collections) {
		const collectionTokens = tokens.filter((token) => token.collectionId === collection.id);
		data.push({
			metadata: collection,
			tokens: collectionTokens,
		});
	}

	return data;
}
