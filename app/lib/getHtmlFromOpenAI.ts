import { OPENAI_USER_PROMPT, OPEN_AI_SYSTEM_PROMPT } from '../prompt'

import { generate } from '../actions/genai'

const getRandomImage = (Images: any) => {
	const random = Images[Math.floor(Math.random() * Images.length)]
	return random
}

export async function getHtmlFromOpenAI({
	text,
	systemPrompt,
	userPrompt,
	max_tokens,
	temperature,
	model,
	UIScreens,
	isUpdateRequest,
}: {
	text: string
	systemPrompt?: string
	userPrompt?: string
	max_tokens?: number
	temperature?: number
	model?: string
	UIScreens?: any
	isUpdateRequest?: boolean
}) {
	const messages: GPT4VCompletionRequest['messages'] = [
		{
			role: 'system',
			content: systemPrompt ? systemPrompt : OPEN_AI_SYSTEM_PROMPT,
		},
		{
			role: 'user',
			content: [],
		},
	]

	const userContent = messages[1].content as Exclude<MessageContent, string>

	// Add the prompt into
	userContent.push({
		type: 'text',
		text: userPrompt ? userPrompt : OPENAI_USER_PROMPT,
	})


	if (isUpdateRequest) {
		userContent.push({
			type: 'text',
			text: text,
		})
		
	} else {
		// Add the strings of text
		if (text) {
			userContent.push({
				type: 'text',
				text: `Here is the specification for the design:\n${text}`,
			})
		}

		if (UIScreens) {
			userContent.push({
				type: 'text',
				text: 'Here are example UI screens which your design should be based on:',
			})
			userContent.push({
				type: 'image_url',
				image_url: {
					url: getRandomImage(UIScreens.data),
					detail: 'auto',
				},
			})
			userContent.push({
				type: 'text',
				text: 'Ignore the color, font, text , logo and branding of the screens. Focus on the layout and structure of the screens.',
			})
		}
	}

	const body: GPT4VCompletionRequest = {
		model: 'gpt-4o',
		max_tokens: max_tokens ? max_tokens : 4096,
		temperature: temperature ? temperature : 0,
		messages,
	}

	const json = await generate(body)
	return json
}

type MessageContent =
	| string
	| (
			| string
			| {
					type: 'text' | 'image_url'
					text?: string
					image_url?: {
						url: string
						detail: 'low' | 'auto' | 'high'
					}
			  }
	  )[]

export type GPT4VCompletionRequest = {
	model: string
	messages: {
		role: 'system' | 'user' | 'assistant' | 'function'
		content: MessageContent
		name?: string | undefined
	}[]
	functions?: any[] | undefined
	function_call?: any | undefined
	stream?: boolean | undefined
	temperature?: number | undefined
	top_p?: number | undefined
	max_tokens?: number | undefined
	n?: number | undefined
	best_of?: number | undefined
	frequency_penalty?: number | undefined
	presence_penalty?: number | undefined
	seed?: number | undefined
	logit_bias?:
		| {
				[x: string]: number
		  }
		| undefined
	stop?: (string[] | string) | undefined
}
