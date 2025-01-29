'use server';

import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import type { Token } from './types';

const openai = createOpenAI({
	compatibility: 'strict',
	apiKey: process.env.OPENAI_API_KEY,
});

export async function generateSummary({ token }: { token: Token }) {
	const { text } = await generateText({
		model: openai('gpt-4o-mini'),
		messages: [
			{
				role: 'system',
				content:
					'You are a UX expert analyzing a design concept image from a web3/crypto project. ' +
					'Focus on identifying: ' +
					'1. The core UX problem being solved ' +
					"2. The proposed solution's key features " +
					'3. UI elements highlighted ' +
					'Keep your response to one sentence and be concise. ',
			},
			{
				role: 'user',
				content: [
					{
						type: 'text',
						text: `Analyze the design concept image. Idea: ${token.name}. Description: ${token.description}`,
					},
					{
						type: 'image',
						image: new URL(`https://gateway.pinata.cloud/ipfs/${token.imageHash}`),
						mimeType: 'image/jpeg',
					},
				],
			},
		],
	});

	console.log(text);

	return text;
}
