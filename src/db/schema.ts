import { int, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const collectionsTable = sqliteTable('collections', {
	id: int().primaryKey(),
	name: text().notNull(),
	description: text(),
	chainId: int(),
	contractAddress: text(),
});

export const tokensTable = sqliteTable(
	'tokens',
	{
		collectionId: int()
			.references(() => collectionsTable.id, { onUpdate: 'cascade' })
			.notNull(),
		tokenId: int().notNull(),
		uriHash: text().notNull(),
		name: text(),
		imageHash: text(),
		description: text(),
		aiDescription: text(),
		mintDate: int({ mode: 'timestamp_ms' }),
	},
	(table) => {
		return [primaryKey({ columns: [table.collectionId, table.tokenId] })];
	}
);
