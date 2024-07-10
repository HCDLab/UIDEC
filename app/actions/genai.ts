'use server'
export async function generate(body: any) {
	let json = null
	const apiKey = process.env.OPENAI_API_KEY
	try {
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
	} catch (e: any) {
		throw Error(`Could not contact OpenAI: ${e.message}`)
	}
	return json
}
