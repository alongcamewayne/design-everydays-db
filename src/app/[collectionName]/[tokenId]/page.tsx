import Image from 'next/image';
import { notFound } from 'next/navigation';
import { and, eq } from 'drizzle-orm';
import { db } from '@/server/db';
import { tokensTable } from '@/server/db/schema';
import { AIButton } from './AIButton';

type Params = { params: { collectionName: string; tokenId: string } };

export const revalidate = 0;

function hashToLink(hash: string) {
	return `https://ipfs.io/ipfs/${hash}`;
}

async function getToken({ collectionName, tokenId }: { collectionName: string; tokenId: number }) {
	const collectionId = collectionName === 'season-one' ? 1 : 2;
	const token = await db.query.tokensTable.findFirst({
		where: and(eq(tokensTable.collectionId, collectionId), eq(tokensTable.tokenId, tokenId)),
	});
	if (!token) notFound();
	return { token };
}

export default async function Page({ params }: Params) {
	const { collectionName, tokenId } = await params;
	const { token } = await getToken({ collectionName, tokenId: Number(tokenId) });

	return (
		<div>
			<h1>{token.name}</h1>
			<p>{token.description}</p>

			<AIButton token={token} />

			{token.imageHash && (
				<div className="relative h-[500px] w-[500px]">
					<Image
						src={hashToLink(token.imageHash)}
						alt={token.name || 'token image'}
						fill={true}
						className="object-contain"
					/>
				</div>
			)}
		</div>
	);
}
