import { DESIGN_SYSTEM_TOKENS, OPENAI_USER_PROMPT, OPEN_AI_SYSTEM_PROMPT } from '../prompt'

import { generate } from '../actions/genai'

const getRandomImage = (Images: any) => {
	// Check if Images is defined and not empty
	if (!Images || !Array.isArray(Images) || Images.length === 0) {
		console.warn("No images provided to getRandomImage");
		return ""; // Return empty string or a default image URL if needed
	}
	const random = Images[Math.floor(Math.random() * Images.length)]
	return random
}

export async function getHtmlFromOpenAI({
	text,
	systemPrompt,
	userPrompt,
	specificationPrompt,
	UIScreensPrompt,
	max_tokens,
	temperature,
	model,
	UIScreens,
	isUpdateRequest,
	provider,
}: {
	text: string
	systemPrompt?: string
	userPrompt?: string
	specificationPrompt?: string
	UIScreensPrompt?: string
	max_tokens?: number
	temperature?: number
	model?: string
	UIScreens?: any
	isUpdateRequest?: boolean
	provider?: string
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
				text: `${specificationPrompt}:\n${text}`,
			})

			userContent.push({
				type: 'text',
				text: 'Specification described above, First, please generate content that will be use for a fictional website or web application',
			})
		}

		//check if the design spec text contains Design Theme: ${designTheme}\n  replace the Design Theme with the expanded Design Theme from DESIGN_SYSTEM_TOKENS
		if (text.includes('Design Theme:')) {
			const designSystem = text.split('Design Theme:')[1].split('\n')[0].trim()
			const designSystemToken = DESIGN_SYSTEM_TOKENS.find((theme) => theme.Name === designSystem)
			if (designSystemToken) {
				userContent.push({
					type: 'text',
					text: `Please use the following Design Theme: ${designSystemToken.Name} specifications below, Ignore the Design Theme color and font settings if already provided in the design spec.\n\n
					${JSON.stringify(designSystemToken, null, 2)}`,
				})
			}
		}
		
		// Add null check for UIScreens
		if (UIScreens && UIScreens.data && Array.isArray(UIScreens.data) && UIScreens.data.length > 0) {
			userContent.push({
				type: 'text',
				text: UIScreensPrompt,
			})
			userContent.push({
				type: 'image_url',
				image_url: {
					url: getRandomImage(UIScreens.data),
					detail: 'high',
				},
			})
		}
	}

	const body: GPT4VCompletionRequest = {
		model: model || 'gpt-4o',
		max_tokens: max_tokens || 8000,
		temperature: temperature ? temperature : 0,
		messages,
		provider: provider || 'openai',
	}

	// Add format instructions for Claude to prevent truncated responses
	if ((provider || 'openai') === 'claude') {
		// Add a special system message for Claude to ensure proper formatting
		const formatInstructions = "IMPORTANT: When returning HTML, please ensure it is complete and not truncated. Wrap the HTML in a markdown code block with ```html at the start and ``` at the end.";
		
		// Add to first message if it's a system message
		if (messages[0].role === 'system') {
			messages[0].content = `${messages[0].content}\n\n${formatInstructions}`;
		} else {
			// Insert a new system message at the beginning
			messages.unshift({
				role: 'system',
				content: formatInstructions
			});
		}
	}

	const json = await generate(body)

	// Add proper error handling for response formats
	if (!json) {
		console.error('No response received from AI provider');
		throw Error('No response received from AI provider');
	}

	// Check if there was an error in the response
	if (json.error) {
		console.error(`Error from AI provider: ${json.error.message || 'Unknown error'}`);
		throw Error(`Error from AI provider: ${json.error.message || 'Unknown error'}`);
	}

	// Log response for debugging
	console.log(`AI response received from ${provider}. First 200 chars:`, 
		json.choices && json.choices[0]?.message?.content 
			? json.choices[0].message.content.substring(0, 200) + '...' 
			: 'No content in expected format');

	// Handle different response formats between providers
	// This ensures we don't access properties of undefined
	if (!json.choices || !Array.isArray(json.choices) || json.choices.length === 0) {
		// Try to extract content directly for providers with different formats
		if (json.content && Array.isArray(json.content) && json.content.length > 0) {
			console.log('Converting alternative response format to standard format');
			return {
				choices: [{
					message: {
						content: json.content[0].text || ''
					}
				}]
			};
		}
		
		// If we still can't find content, throw a specific error
		console.error('Invalid response format from AI provider:', JSON.stringify(json).substring(0, 500));
		throw Error('Invalid response format: missing choices array');
	}

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
	provider?: string | undefined
	logit_bias?:
		| {
				[x: string]: number
		  }
		| undefined
	stop?: (string[] | string) | undefined
}
