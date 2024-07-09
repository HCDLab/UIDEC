import {  } from './getHtmlFromOpenAI'
import {  } from "./getSelectionAsText"
import {  } from './addGridToSvg'
import {  } from './blobToBase64'

import { Editor, createShapeId } from '@tldraw/tldraw'

import { PreviewShape } from '../PreviewShape/PreviewShape'
import { getHtmlFromOpenAI } from './getHtmlFromOpenAI'

export async function makeReal(
	editor: Editor,
	designSpecs?: string,
	systemPrompt?: string,
	userPrompt?: string,
	max_tokens?: number,
	temperature?: number,
	model?: string,
	UIScreens?: any

) {
	// Get the selected shapes (we need at least one)
	const selectedShapes = editor.getSelectedShapes()

	// Create the preview shape
	const newShapeId = createShapeId()
	editor.createShape<PreviewShape>({
		id: newShapeId,
		type: 'preview',
		x: 0,
		y: 0,
		props: { html: '' },
	})

	// Get any previous previews among the selected shapes
	const previousPreviews = [] as PreviewShape[]

	// Send everything to OpenAI and get some HTML back
	try {
		const json = await getHtmlFromOpenAI({
			text: designSpecs ?? '',
			systemPrompt,
			userPrompt,
			max_tokens,
			temperature,
			model,
			UIScreens,
		})
		console.log(json)
		if (!json) {
			throw Error('Could not contact OpenAI.')
		}

		if (json?.error) {
			throw Error(`${json.error.message?.slice(0, 128)}...`)
		}

		// Extract the HTML from the response
		const message = json.choices[0].message.content
		const start = message.indexOf('<!DOCTYPE html>')
		const end = message.indexOf('</html>')
		const html = message.slice(start, end + '</html>'.length)

		// No HTML? Something went wrong
		if (html.length < 100) {
			console.warn(message)
			throw Error('Could not generate a design from those wireframes.')
		}

		// Update the shape with the new props
		editor.updateShape<PreviewShape>({
			id: newShapeId,
			type: 'preview',
			props: {
				html,
				uploadedShapeId: newShapeId,
			},
		})
		console.log(`Response: ${message}`)
	} catch (e) {
		// If anything went wrong, delete the shape.
		editor.deleteShape(newShapeId)
		throw e
	}
}
