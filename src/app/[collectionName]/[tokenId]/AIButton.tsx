'use client';

import { tokensTable } from '@/server/db/schema';
import { getAiCaption } from './ai';

export function AIButton({ token }: { token: typeof tokensTable.$inferSelect }) {
	return (
		<div>
			<button onClick={() => getAiCaption({ token })}>log ai caption</button>
		</div>
	);
}
