'use client';

import { Button } from '@/components/ui/button'
import { makeReal } from"../lib/makeReal"
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
}

export function MakeRealButton({ generateDesignsConstraints, editor, systemPrompt, 
	userPrompt,
	max_tokens,
	temperature,
	model,
	UIScreens
}: MakeRealButtonProps) {
	const handleClick = useCallback(async () => {
		try {
			await makeReal(editor, generateDesignsConstraints(), systemPrompt, userPrompt, max_tokens, temperature, model, UIScreens)
		} catch (e) {
			console.error(e)
			editor.toast({
				icon: 'cross-2',
				title: 'Something went wrong',
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
