'use client';

import { Button } from '@/components/ui/button'
import { makeReal } from"../lib/makeReal"
import { toast } from 'sonner';
import { useCallback } from 'react'

interface MakeRealButtonProps {
	generateDesignsConstraints: () => string,
	editor: any
	systemPrompt?: string
	userPrompt?: string
	specificationPrompt?: string
	UIScreensPrompt?: string
	max_tokens?: number
	temperature?: number
	model?: string
	provider?: string
	UIScreens?: any
	settings?: any
}

export function MakeRealButton({ generateDesignsConstraints, editor, systemPrompt, 
	userPrompt,
	specificationPrompt,
	UIScreensPrompt,
	max_tokens,
	temperature,
	model,
	provider,
	UIScreens,
	settings
}: MakeRealButtonProps) {
	const handleClick = useCallback(async () => {
		try {
			// Add validation for all required parameters
			if (!editor) {
				throw new Error("Editor is required but was not provided");
			}
			
			// Make sure we have a valid constraints string
			const constraints = generateDesignsConstraints();
			if (!constraints || typeof constraints !== 'string' || constraints.trim() === '') {
				throw new Error("Design constraints cannot be empty");
			}
			
			// Ensure UIScreens is properly initialized
			const validatedUIScreens = UIScreens || { data: [] };
			
			// Set default values for optional parameters
			const validatedModel = model || 'gpt-4o';
			const validatedProvider = provider || 'openai';
			
			// Log parameters for debugging
			console.log("Generating design with parameters:", {
				model: validatedModel,
				provider: validatedProvider,
				maxTokens: max_tokens,
				temperature,
				hasUIScreens: validatedUIScreens.data && validatedUIScreens.data.length > 0
			});
			
			await makeReal(
				editor, 
				constraints, 
				systemPrompt, 
				userPrompt, 
				specificationPrompt,
				UIScreensPrompt, 
				max_tokens, 
				temperature, 
				validatedModel, 
				validatedUIScreens, 
				settings,
				validatedProvider
			)
		} catch (e) {
			console.error(e)
			toast.error('Something went wrong', {
				duration: 5000,
				description: (e as Error).message.slice(0, 100),
			})
		}
	}, [editor, generateDesignsConstraints, systemPrompt, userPrompt, specificationPrompt, UIScreensPrompt, max_tokens, temperature, model, UIScreens, settings, provider])

	return (
		<Button className="w-full"
			onClick={handleClick}
		>Generate design</Button>
	)
}
