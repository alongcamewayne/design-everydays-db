import { Glob } from 'bun';
import { mainnet, zora } from 'viem/chains';
import { reset } from 'drizzle-seed';
import type { NewCollection } from '@/lib/types';
import { db } from '@/server/db';
import * as schema from '@/server/db/schema';
import snapshotTokens from '../../../token-snapshot.json';

const outputDir = 'src/server/scripts/output';
const glob = new Glob('*-token-output.json');
const filePaths: string[] = [];

let tokens = snapshotTokens;

for await (const file of glob.scan(outputDir)) {
	filePaths.push(`${outputDir}/${file}`);
}

if (filePaths.length) {
	filePaths.sort((a, b) => {
		const aDate = parseInt(a.split('-')[0]);
		const bDate = parseInt(b.split('-')[0]);
		return bDate - aDate;
	});

	const file = Bun.file(filePaths[0]);
	const data = await file.json();
	tokens = data;
}

export const collections: NewCollection[] = [
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
	await db.insert(schema.collectionsTable).values(collections).onConflictDoNothing();
	await db.insert(schema.tokensTable).values(tokens);
} catch (error) {
	console.error(error);
}
