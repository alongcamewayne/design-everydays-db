import Link from 'next/link';

export const revalidate = 0;

export default function Home() {
	return (
		<div>
			<div className="font-bold">Design Everydays</div>

			<div className="flex flex-col">
				<Link href="/season-one">Season 1</Link>
				<Link href="/season-two">Season 2</Link>
			</div>
		</div>
	);
}
