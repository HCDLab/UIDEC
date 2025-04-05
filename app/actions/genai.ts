'use server'
export async function generate(body: any) {
	let json = null
	
	const provider = body.provider || 'openai'
	
	// Remove the provider from the body to avoid sending it to the APIs
	const { provider: _, ...apiBody } = body
	
	if (provider === 'openai') {
		const apiKey = process.env.OPENAI_API_KEY
		try {
			const resp = await fetch('https://api.openai.com/v1/chat/completions', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${apiKey}`,
				},
				body: JSON.stringify(apiBody),
				cache: 'no-store',
			})
			json = await resp.json()
		} catch (e: any) {
			throw Error(`Could not contact OpenAI: ${e.message}`)
		}
	} else if (provider === 'claude') {
		const apiKey = process.env.ANTHROPIC_API_KEY
		try {
			// Extract system message if present
			const systemMessage = apiBody.messages.find((msg: any) => msg.role === 'system');
			const nonSystemMessages = apiBody.messages.filter((msg: any) => msg.role !== 'system');
			
			// Transform messages for Claude format
			const claudeMessages = nonSystemMessages.map((msg: any) => {
				// Handle array content (text and images)
				if (Array.isArray(msg.content)) {
					// Convert content array to Claude format
					const content = msg.content.map((item: any) => {
						if (typeof item === 'string') {
							return { type: 'text', text: item };
						}
						
						if (item.type === 'text') {
							return { type: 'text', text: item.text };
						}
						
						if (item.type === 'image_url') {
							return {
								type: 'image',
								source: {
									type: 'url',
									url: item.image_url.url,
								}
							};
						}
						
						return item;
					});
					
					return {
						role: msg.role,
						content
					};
				}
				
				// Handle string content
				return {
					role: msg.role,
					content: typeof msg.content === 'string' 
						? [{ type: 'text', text: msg.content }] 
						: msg.content
				};
			});
			
			const resp = await fetch('https://api.anthropic.com/v1/messages', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'x-api-key': `${apiKey}`,
					'anthropic-version': '2023-06-01',
				},
				body: JSON.stringify({
					model: apiBody.model,
					max_tokens: apiBody.max_tokens,
					temperature: apiBody.temperature,
					system: systemMessage ? systemMessage.content : undefined,
					messages: claudeMessages,
				}),
				cache: 'no-store',
			})

			// Check if response is OK before parsing JSON
			if (!resp.ok) {
				const errorText = await resp.text();
				console.error(`Claude API error (${resp.status}):`, errorText);
				throw Error(`Claude API returned status ${resp.status}: ${errorText.slice(0, 200)}`);
			}

			json = await resp.json()
			console.log("Claude API response:", JSON.stringify(json).slice(0, 500) + "...");
			
			// Transform Claude's response to match OpenAI format
			if (json.content && Array.isArray(json.content) && json.content.length > 0) {
				// Extract text content from Claude response
				const contentItem = json.content[0];
				const contentText = contentItem && contentItem.text ? contentItem.text : '';
				
				
				// Check for complex output format with metadata and references
				const hasComplexFormat = contentText.match(/\d+:\[.*?\].*?\d+:.*?```(?:html|HTML)?/);
				if (hasComplexFormat) {
					console.log("Detected complex format with metadata in Claude's response");
				}
				
				// Check for markdown code blocks
				const hasCodeBlock = contentText.includes("```html") || 
					contentText.includes("```HTML") || 
					contentText.includes("```");
					
				if (hasCodeBlock) {
					console.log("Detected code block in Claude's response");
				}
				
				let processedContent = contentText;
				
				const truncatedJsonMatch = contentText.match(/(\d+:{"choices":\[{"message":{"content":".*}}\]\})\s*$/);
				if (truncatedJsonMatch) {
					console.log("Detected truncated JSON at the end, cleaning up");
					processedContent = contentText.replace(truncatedJsonMatch[1], '');
				}
				
				json = {
					choices: [{
						message: {
							content: processedContent
						}
					}]
				};
			} else if (json.error) {
				json = { error: json.error };
				console.error("Claude API returned an error:", json.error);
			} else {
				console.error("Unexpected Claude response format:", JSON.stringify(json).substring(0, 500));
				json = {
					choices: [{
						message: {
							content: "Error: Unable to parse response from Claude. Please try again."
						}
					}]
				};
			}
		} catch (e: any) {
			throw Error(`Could not contact Claude: ${e.message}`)
		}
	} else {
		throw Error(`Unsupported provider: ${provider}`)
	}
	
	return json
}
