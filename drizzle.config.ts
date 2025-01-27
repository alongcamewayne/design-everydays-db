import dotenv from 'dotenv';
import { defineConfig } from 'drizzle-kit';

dotenv.config({ path: '.env.local' });

export default defineConfig({
	out: './src/db/drizzle',
	schema: './src/db/schema.ts',
	dialect: 'sqlite',
	casing: 'snake_case',
	dbCredentials: {
		url: String(process.env.DATABASE_URL),
	},
});
