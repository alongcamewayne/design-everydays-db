import type { collectionsTable, tokensTable } from '@/server/db/schema';

export type Collection = typeof collectionsTable.$inferSelect;
export type NewCollection = typeof collectionsTable.$inferInsert;

export type Token = typeof tokensTable.$inferSelect;
export type NewToken = typeof tokensTable.$inferInsert;
