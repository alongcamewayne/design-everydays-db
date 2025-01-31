'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { saveAiSummary, type getData } from '@/server/db/utils';
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from './ui/button';
import { generateSummary } from '@/lib/ai';
import type { Token } from '@/lib/types';
import { toast } from 'sonner';

type TokenTableProps = {
	data: Awaited<ReturnType<typeof getData>>[number];
};

function truncateUri(uri: string) {
	const start = uri.slice(0, 6);
	const end = uri.slice(-6);

	return `${start}...${end}`;
}

export default function TokenTable({ data }: TokenTableProps) {
	const [activeTokenId, setActiveTokenId] = useState<number | undefined>();
	const [aiSummary, setAISummary] = useState<string>('');
	const [loading, setLoading] = useState<boolean>(false);

	useEffect(() => {
		setAISummary('');
	}, [activeTokenId]);

	async function generateAiSummary(token: Token) {
		toast.info('Generating AI Summary...');
		setLoading(true);

		try {
			const summary = await generateSummary({ token });
			setAISummary(summary);
			toast.success('Successfully generated AI Summary!');
		} catch (error) {
			console.error(error);
			toast.error('Failed to generate AI Summary, please try again.');
		}

		setLoading(false);
	}

	async function saveSummary(token: Token) {
		const { success } = await saveAiSummary({ token, summary: aiSummary });

		if (!success) {
			toast.error('Failed to save summary, please try again.');
			return;
		}

		data.tokens[activeTokenId!].aiDescription = aiSummary;
		setAISummary('');
		toast.success('Successfully saved summary to database!');
	}

	return (
		<Table>
			<TableCaption>A list of your recent invoices.</TableCaption>

			<TableHeader className="bg-zinc-100">
				<TableRow>
					<TableHead className="w-[50px]">ID</TableHead>
					<TableHead>Name</TableHead>
					<TableHead>Concept</TableHead>
				</TableRow>
			</TableHeader>

			<TableBody>
				{data.tokens.map((token) => {
					return (
						<Sheet
							key={token.tokenId}
							onOpenChange={(open) => setActiveTokenId(open ? token.tokenId : undefined)}>
							<SheetTrigger asChild>
								<TableRow className="cursor-pointer">
									<TableCell className="font-medium">{token.tokenId}</TableCell>
									<TableCell>{token.name}</TableCell>
									<TableCell className="max-w-sm truncate text-muted-foreground">
										{token.description}
									</TableCell>
								</TableRow>
							</SheetTrigger>
							<SheetContent className="w-full overflow-y-auto sm:max-w-lg">
								<SheetHeader>
									<SheetTitle>{token.name}</SheetTitle>
									<SheetDescription className="sr-only">{token.description}</SheetDescription>
								</SheetHeader>

								<div className="my-2 flex flex-col gap-4">
									<div className="relative aspect-square w-full overflow-hidden rounded">
										<div className="absolute left-0 top-0 aspect-square w-full animate-pulse bg-gray-500"></div>
										<Image
											src={`https://nftstorage.link/ipfs/${token.imageHash}`}
											alt={token.name || 'token image'}
											fill={true}
											className="object-contain"
										/>
									</div>

									{token.description && (
										<div>
											<p className="mb-1 text-sm font-semibold text-secondary-foreground">
												◆ Concept
											</p>
											<p>{token.description}</p>
										</div>
									)}

									{activeTokenId === token.tokenId && (aiSummary || token.aiDescription) && (
										<div>
											<p className="mb-1 text-sm font-semibold text-secondary-foreground">
												◆ AI Summary
											</p>
											<p>{aiSummary || token.aiDescription}</p>
											{aiSummary && aiSummary !== token.aiDescription && (
												<Button
													onClick={() => saveSummary(token)}
													variant="outline"
													className="mt-2">
													Save Summary
												</Button>
											)}
										</div>
									)}

									<div className="flex flex-col divide-y text-sm">
										<div className="flex justify-between py-2">
											<p>Token ID</p>
											<p>{token.tokenId}</p>
										</div>

										<div className="flex justify-between py-2">
											<p>IPFS URI</p>
											<Link
												href={`https://nftstorage.link/ipfs/${token.uriHash}`}
												target="_blank"
												className="border-b border-primary/20">
												{truncateUri(token.uriHash)}
											</Link>
										</div>

										<div className="flex justify-between py-2">
											<p>Mint Date</p>
											{/* @ts-expect-error revisit when dates are populated */}
											<p>{token.mintDate}</p>
										</div>
									</div>

									<div className="flex flex-col gap-2">
										<Button asChild>
											<Link
												href={`https://zora.co/collect/${data.metadata.chainId === 1 ? 'eth' : data.metadata.chainId === 7777777 ? 'zora' : 'base'}:${data.metadata.contractAddress}/${token.tokenId}`}
												target="_blank"
												className="py-5">
												Open on Zora
											</Link>
										</Button>

										<Button
											variant="secondary"
											onClick={() => generateAiSummary(token)}
											disabled={loading}
											className="border py-5">
											{loading ? 'Generating...' : '✨ Generate AI Summary ✨'}
										</Button>
									</div>
								</div>
							</SheetContent>
						</Sheet>
					);
				})}
			</TableBody>
		</Table>
	);
}
