import { Glob } from 'bun';
import type { NewToken } from '@/lib/types';
import { db } from '@/server/db';
import * as schema from '@/server/db/schema';

const outputDir = 'src/server/scripts/output';
const glob = new Glob('*-token-output.json');
const filePaths: string[] = [];

let tokens: NewToken[] = [];

for await (const file of glob.scan(outputDir)) {
	filePaths.push(`${outputDir}/${file}`);
}

if (!filePaths.length) {
	console.log('No token files found. Run fetch:tokens first.');
	process.exit(0);
}

filePaths.sort((a, b) => {
	const aDate = parseInt(a.split('-')[0]);
	const bDate = parseInt(b.split('-')[0]);
	return bDate - aDate;
});

const file = Bun.file(filePaths[0]);
const data = await file.json();

tokens = data;
if (tokens.length) {
	try {
		await db.insert(schema.tokensTable).values(tokens);
	} catch (error) {
		console.error(error);
	}
}
