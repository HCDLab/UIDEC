'use client';

import { useCallback, useState } from 'react'

import { Button } from '@/components/ui/button'
import { TLShapeId } from '@tldraw/tldraw';
import { toast } from 'sonner';
import { updateDesign } from '../lib/updateDesign';

interface UpdateDesignButtonProps {
	selectedElement:any
	editor: any
	shapeID: TLShapeId
	originalHTML: string
	modifications?: string
	styles?: string
	buttonText?:string
}

export default function UpdateDesignButton({ 
	selectedElement, 
	editor, 
	shapeID,
	originalHTML,
	modifications,
	styles,
	buttonText
}: UpdateDesignButtonProps) {

	const outerHTML = selectedElement.outerHTML.replace(/\n/g, '').replace(/\s{2,}/g, ' ')
	const innerHTML = selectedElement.innerHTML.replace(/\n/g, '').replace(/\s{2,}/g, ' ')

	const combinedHTML = outerHTML.replace(innerHTML, '')
	
	const changes = `Target element to change: 
	${combinedHTML}
	Changes requested:
	${modifications}`

    const [isGenerating, setIsGenerating] = useState(false)	

	const handleClick = useCallback(async () => {
		try {
			setIsGenerating(true)
			await updateDesign(editor, shapeID, changes, originalHTML)
			setIsGenerating(false)
		} catch (e) {
			toast.error('Something went wrong', {
				duration: 5000,
				description: (e as Error).message.slice(0, 100),
			})
			setIsGenerating(false)
		}
	}, [editor, shapeID, changes, originalHTML])

	return (
		<Button className={`w-full ${styles}`}
		  	disabled={isGenerating}
			onClick={handleClick}
		>{isGenerating ? 'Updating design...' : buttonText }</Button>
	)
}
