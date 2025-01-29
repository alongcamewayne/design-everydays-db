'use client';

import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Button } from './ui/button';
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet';
import Link from 'next/link';
import Image from 'next/image';
import type { getData } from '@/server/db/utils';

type TokenTableProps = {
	data: Awaited<ReturnType<typeof getData>>[number];
};

function truncateUri(uri: string) {
	const start = uri.slice(0, 6);
	const end = uri.slice(-6);

	return `${start}...${end}`;
}

export default function TokenTable({ data }: TokenTableProps) {
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
						<Sheet key={token.tokenId}>
							<SheetTrigger asChild>
								<TableRow className="cursor-pointer">
									<TableCell className="font-medium">{token.tokenId}</TableCell>
									<TableCell>{token.name}</TableCell>
									<TableCell className="text-muted-foreground max-w-sm truncate">
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
											src={`https://gateway.pinata.cloud/ipfs/${token.imageHash}`}
											alt={token.name || 'token image'}
											fill={true}
											className="object-contain"
										/>
									</div>

									<div>
										<p className="text-secondary-foreground mb-1 text-sm font-semibold">Concept</p>
										<p>{token.description}</p>
									</div>

									<div className="flex flex-col divide-y text-sm">
										<div className="flex justify-between py-2">
											<p>Token ID</p>
											<p>{token.tokenId}</p>
										</div>

										<div className="flex justify-between py-2">
											<p>IPFS URI</p>
											<Link
												href={`https://gateway.pinata.cloud/ipfs/${token.uriHash}`}
												target="_blank"
												className="border-primary/20 border-b">
												{truncateUri(token.uriHash)}
											</Link>
										</div>

										<div className="flex justify-between py-2">
											<p>Mint Date</p>
											{/* @ts-expect-error revisit when dates are populated */}
											<p>{token.mintDate}</p>
										</div>
									</div>

									<Button asChild>
										<Link
											href={`https://zora.co/collect/${data.metadata.chainId === 1 ? 'eth' : 'zora'}:${data.metadata.contractAddress}/${token.tokenId}`}
											target="_blank">
											Open on Zora
										</Link>
									</Button>
								</div>
							</SheetContent>
						</Sheet>
					);
				})}
			</TableBody>
		</Table>
	);
}
