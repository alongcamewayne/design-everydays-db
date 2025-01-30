import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	/* config options here */
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'nftstorage.link',
				port: '',
				pathname: '/ipfs/**',
				search: '',
			},
		],
	},
};

export default nextConfig;
