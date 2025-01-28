import { notFound } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { db } from '@/server/db';
import { collectionsTable, tokensTable } from '@/server/db/schema';
import Link from 'next/link';

type Params = { params: { collectionName: string } };

export const revalidate = 0;

async function getTokens({ collectionName }: { collectionName: string }) {
	if (!['season-one', 'season-two'].includes(collectionName)) notFound();
	const collectionId = collectionName === 'season-one' ? 1 : 2;

	const [collection, tokens] = await Promise.all([
		await db.query.collectionsTable.findFirst({
			where: eq(collectionsTable.id, collectionId),
		}),
		await db.select().from(tokensTable).where(eq(tokensTable.collectionId, collectionId)),
	]);

	if (!collection) notFound();
	return { collection, tokens };
}

export default async function Page({ params }: Params) {
	const { collectionName } = await params;
	const { collection, tokens } = await getTokens({ collectionName });

	return (
		<div>
			<h1>Season {collection.id}</h1>
			<p>{collection.contractAddress}</p>

			<ul>
				{tokens.map((token) => (
					<li key={token.tokenId}>
						<Link href={`/${collectionName}/${token.tokenId}`}>{token.name}</Link>
					</li>
				))}
			</ul>
		</div>
	);
}
