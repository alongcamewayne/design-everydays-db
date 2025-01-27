export default [
	{
		inputs: [],
		name: 'contractURI',
		outputs: [{ internalType: 'string', name: '', type: 'string' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
		name: 'getTokenInfo',
		outputs: [
			{
				components: [
					{ internalType: 'string', name: 'uri', type: 'string' },
					{ internalType: 'uint256', name: 'maxSupply', type: 'uint256' },
					{ internalType: 'uint256', name: 'totalMinted', type: 'uint256' },
				],
				internalType: 'struct IZoraCreator1155TypesV1.TokenData',
				name: '',
				type: 'tuple',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'nextTokenId',
		outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
		name: 'uri',
		outputs: [{ internalType: 'string', name: '', type: 'string' }],
		stateMutability: 'view',
		type: 'function',
	},
] as const;
