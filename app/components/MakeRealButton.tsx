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
	max_tokens?: number
	temperature?: number
	model?: string
	UIScreens?: any
	settings?: any
}

export function MakeRealButton({ generateDesignsConstraints, editor, systemPrompt, 
	userPrompt,
	max_tokens,
	temperature,
	model,
	UIScreens,
	settings
}: MakeRealButtonProps) {
	const handleClick = useCallback(async () => {
		try {
			await makeReal(editor, generateDesignsConstraints(), systemPrompt, userPrompt, max_tokens, temperature, model, UIScreens, settings)
		} catch (e) {
			console.error(e)
			toast.error('Something went wrong', {
				duration: 5000,
				description: (e as Error).message.slice(0, 100),
			})
		}
	}, [editor, generateDesignsConstraints])

	return (
		<Button className="w-full"
			onClick={handleClick}
		>Add a new design</Button>
	)
}
