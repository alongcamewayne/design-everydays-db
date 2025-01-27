import dotenv from 'dotenv';
import { defineConfig } from 'drizzle-kit';

dotenv.config({ path: '.env.local' });

export default defineConfig({
	out: './src/db/drizzle',
	schema: './src/db/schema.ts',
	dialect: 'turso',
	casing: 'snake_case',
	dbCredentials: {
		url: String(process.env.DATABASE_URL),
		authToken: String(process.env.DATABASE_AUTH_TOKEN),
	},
});
