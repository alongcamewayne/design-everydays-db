import { getData } from '@/server/db/utils';
import Home from '@/components/Home';

export default async function Page() {
	const data = await getData();

	return (
		<div className="max-w-2xl p-4">
			<div className="border-b-2 border-black pb-0.5 font-bold">
				<p>Design Everydays</p>
			</div>

			{/* <div className="flex flex-col">
				<Link href="/season-one">Season 1</Link>
				<Link href="/season-two">Season 2</Link>
			</div> */}

			<Home data={data} />
		</div>
	);
}
