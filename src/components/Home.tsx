'use client';

import { useState } from 'react';
import type { getData } from '@/server/db/utils';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TokenTable from '@/components/TokenTable';

type HomeProps = {
	data: Awaited<ReturnType<typeof getData>>;
};

export default function Home({ data }: HomeProps) {
	const [activeChoice, setActiveChoice] = useState('0');

	return (
		<div>
			<div className="my-5">
				<RadioGroup
					className="grid grid-cols-3"
					defaultValue="0"
					onValueChange={(e) => setActiveChoice(e)}>
					{data.map(({ metadata, tokens }, i) => {
						return (
							<div key={i} className="flex w-full gap-2">
								<RadioGroupItem
									id={metadata.name}
									value={String(i)}
									checked={activeChoice === String(i)}
									className="peer sr-only focus:outline-none"
								/>
								<Label
									htmlFor={metadata.name}
									className="w-full cursor-pointer overflow-hidden rounded-none transition hover:bg-primary/10 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-white">
									<Card className="rounded-none border-current bg-transparent text-current">
										<CardHeader>
											<CardTitle>
												{[3, 4, 5].includes(metadata.id)
													? metadata.name.split(',')[1]
													: `Season ${metadata.id}`}
											</CardTitle>
										</CardHeader>
										<CardContent>
											<p>{tokens.length} designs</p>
										</CardContent>
									</Card>
								</Label>
							</div>
						);
					})}
				</RadioGroup>
			</div>

			<TokenTable data={data[Number(activeChoice)]} />
		</div>
	);
}
