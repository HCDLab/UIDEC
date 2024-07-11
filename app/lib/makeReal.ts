import { Editor, createShapeId } from '@tldraw/tldraw'

import { PreviewShape } from '../PreviewShape/PreviewShape'
import { getHtmlFromOpenAI } from './getHtmlFromOpenAI'

function getDocumentMaxHeight(document: Document) {
	var body = document.body,
		html = document.documentElement

	var height = Math.max(
		body.scrollHeight,
		body.offsetHeight,
		html.clientHeight,
		html.scrollHeight,
		html.offsetHeight
	)
	return height
}

function measureHTML(html: string, fixedWidth = 1024): Promise<{ width: number; height: number }> {
	return new Promise<{ width: number; height: number }>((resolve, reject) => {
		const iframe = document.createElement('iframe')
		iframe.style.position = 'absolute'
		iframe.style.top = '-9999px'
		document.body.appendChild(iframe)

		const checkIframeContent = () => {
			const iframeDocument = iframe.contentDocument
			if (iframeDocument && iframeDocument.body) {
				iframeDocument.body.style.width = `${fixedWidth}px`
				iframeDocument.body.style.height = 'auto'
				iframeDocument.body.style.overflow = 'auto'

				const width = iframeDocument.body.scrollWidth
				const height = getDocumentMaxHeight(iframeDocument)
				resolve({ width, height })
				document.body.removeChild(iframe)
			} else {
				// Retry if body is not yet available
				setTimeout(checkIframeContent, 100)
			}
		}

		iframe.onload = () => {
			const iframeDocument = iframe.contentDocument
			if (iframeDocument) {
				iframeDocument.open()
				iframeDocument.write(html)
				iframeDocument.close()
				checkIframeContent()
			} else {
				reject(new Error('iframe contentDocument is null'))
				document.body.removeChild(iframe)
			}
		}

		iframe.onerror = (err) => {
			document.body.removeChild(iframe)
			reject(err)
		}
	})
}


export async function makeReal(
	editor: Editor,
	designSpecs?: string,
	systemPrompt?: string,
	userPrompt?: string,
	max_tokens?: number,
	temperature?: number,
	model?: string,
	UIScreens?: any,
	settings?: any

) {

	const center = editor.getViewportScreenCenter()
	
	console.log(editor.getPageShapeIds(editor.getCurrentPageId()),"fuck")
	// Create the preview shape
	const newShapeId = createShapeId()
	editor.createShape<PreviewShape>({
		id: newShapeId,
		type: 'preview',
		x: center.x,
		y: center.y,
		props: { html: '', settings: settings },
	})


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

		const { width, height } = await measureHTML(html, 1024)

		// Update the shape with the new props
		editor.updateShape<PreviewShape>({
			id: newShapeId,
			type: 'preview',
			props: {
				html,
				w: width,
				h: height,
				uploadedShapeId: newShapeId,
			},
		})
		editor.centerOnPoint({ x: center.x, y: center.y })
		editor.selectAll()
		editor.packShapes(editor.getSelectedShapeIds(), 32)
		editor.deselect()
	} catch (e) {
		// If anything went wrong, delete the shape.
		editor.deleteShape(newShapeId)
		throw e
	}
}
