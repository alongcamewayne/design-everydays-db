'use server';

import { and, asc, eq } from 'drizzle-orm';
import type { Collection, Token } from '@/lib/types';
import { db } from '@/server/db';
import { collectionsTable, tokensTable } from '@/server/db/schema';

type DataArray = {
	metadata: Collection;
	tokens: Token[];
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

export async function saveAiSummary({ token, summary }: { token: Token; summary: string }) {
	try {
		await db
			.update(tokensTable)
			.set({ aiDescription: summary })
			.where(
				and(
					eq(tokensTable.tokenId, token.tokenId),
					eq(tokensTable.collectionId, token.collectionId)
				)
			);
		return { success: true };
	} catch (error) {
		console.error(error);
		return { success: false };
	}
}
