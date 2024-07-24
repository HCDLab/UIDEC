import { Editor, createShapeId } from '@tldraw/tldraw'

import { PreviewShape } from '../PreviewShape/PreviewShape'
import { getHtmlFromOpenAI } from './getHtmlFromOpenAI'

type MeasureResult = {
	width: number
	height: number
}
function getDocumentMaxHeight(document: Document, minHeight: number) {
	const body = document.body
	const html = document.documentElement
	return Math.max(
		minHeight,
		body.scrollHeight,
		body.offsetHeight,
		html.clientHeight,
		html.scrollHeight,
		html.offsetHeight
	)
}

function measureHTML(
	html: string,
	fixedWidth: number,
	minHeight: number
): Promise<{ width: number; height: number }> {
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
				const height = getDocumentMaxHeight(iframeDocument, minHeight)
				resolve({ width, height })
				document.body.removeChild(iframe)
			} else {
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

const deviceDimensions: { [key: string]: { width: number; aspectRatio: number } } = {
	Desktop: { width: 1920, aspectRatio: 16 / 9 },
	Tablet: { width: 768, aspectRatio: 4 / 3 },
	Mobile: { width: 375, aspectRatio: 9 / 16 },
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
	const device = settings.device?.value || 'Desktop'
	const { width: fixedWidth, aspectRatio } = deviceDimensions[device]
	const fixedHeight = fixedWidth / aspectRatio

	const newShapeId = createShapeId()
	editor.createShape<PreviewShape>({
		id: newShapeId,
		type: 'preview',
		x: center.x,
		y: center.y,
		props: { html: '', settings: settings, w: fixedWidth, h: fixedHeight },
	})

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

		if (!json) {
			throw Error('Could not contact OpenAI.')
		}

		if (json?.error) {
			throw Error(`${json.error.message?.slice(0, 128)}...`)
		}

		const message = json.choices[0].message.content
		const start = message.indexOf('<!DOCTYPE html>')
		const end = message.indexOf('</html>')
		const html = message.slice(start, end + '</html>'.length)

		if (html.length < 100) {
			console.warn(message)
			throw Error('Could not generate a design from those wireframes.')
		}

		//Some browsers get stuck in an infinite loop when trying to measure the height of the iframe content.
		const { width, height } = await Promise.race<MeasureResult>([
			measureHTML(html, fixedWidth, fixedHeight),
			new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Timeout')), 2000)),
		])

		if (width && height) {
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
		} else {
			editor.updateShape<PreviewShape>({
				id: newShapeId,
				type: 'preview',
				props: {
					html,
					uploadedShapeId: newShapeId,
				},
			})
		}

		editor.centerOnPoint({ x: center.x, y: center.y })
		editor.selectAll()
		editor.packShapes(editor.getSelectedShapeIds(), 100)
		editor.deselect()
	} catch (e) {
		editor.deleteShape(newShapeId)
		throw e
	}
}
