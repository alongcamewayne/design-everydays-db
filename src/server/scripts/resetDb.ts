import { reset } from 'drizzle-seed';
import { db } from '@/server/db';
import * as schema from '@/server/db/schema';

try {
	// @ts-expect-error - this is correct per docs, but throws a type error. investigate later.
	await reset(db, schema);
	console.log('Database reset.');
} catch (error) {
	console.error(error);
}
