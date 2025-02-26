'use server'
export async function generate(body: any) {
	let json = null
	const provider = body.provider || 'openai'
	delete body.provider // Remove provider from body as it's not needed for the API calls
	
	try {
		if (provider === 'anthropic') {
			const apiKey = process.env.ANTHROPIC_API_KEY
			const resp = await fetch('https://api.anthropic.com/v1/messages', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'x-api-key': apiKey as string,
					'anthropic-version': '2023-06-01'
				},
				body: JSON.stringify(body),
				cache: 'no-store',
			})
			json = await resp.json()
		} else {
			// Default to OpenAI
			const apiKey = process.env.OPENAI_API_KEY
			const resp = await fetch('https://api.openai.com/v1/chat/completions', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${apiKey}`,
				},
				body: JSON.stringify(body),
				cache: 'no-store',
			})
			json = await resp.json()
		}
	} catch (e: any) {
		throw Error(`Could not contact API: ${e.message}`)
	}
	return json
}
