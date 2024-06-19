'use client';

import { Button } from '@/components/ui/button'
import { makeReal } from"../lib/makeReal"
import { useCallback } from 'react'

interface MakeRealButtonProps {
	generateDesignsConstraints: () => string,
	editor: any
}

export function MakeRealButton({ generateDesignsConstraints, editor }: MakeRealButtonProps) {
	const handleClick = useCallback(async () => {
		try {
			await makeReal(editor, generateDesignsConstraints())
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
		>Generate Designs</Button>
	)
}
