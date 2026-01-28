import { Editor, TLShapeId, } from '@tldraw/tldraw'

import { PreviewShape } from '../PreviewShape/PreviewShape'
import { getHtmlFromOpenAI } from './getHtmlFromOpenAI'

export async function updateDesign(editor: Editor, shapeID: TLShapeId, changes?: string, originalHTML?: string) {
	const shape = editor.getShape<PreviewShape>(shapeID)

	if (!shape) {
		throw Error('Could not find the design')
	}

	const prompt = `Here are changes requested by the user on a specific element in the design:\n
	Made the following changes:
	${changes}
	\n
	\n
	This is the original design:
	${originalHTML}

	\n please update the design accordingly.
	`
	try {
		editor.updateShape<PreviewShape>({
			id: shapeID,
			type: 'preview',
			props: {
				html: '',
				uploadedShapeId: "",
			},
		})
		const json = await getHtmlFromOpenAI({
			text: prompt ?? '',
			isUpdateRequest: true,
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
			throw Error('Could not generate a design')
		}

		const history = shape.props.history || []
		const newHistory = [...history, html]
		editor.updateShape<PreviewShape>({
			id: shapeID,
			type: 'preview',
			props: {
				html,
				history: newHistory,
				version: newHistory.length - 1,
				uploadedShapeId: shapeID,
			},
		})
	} catch (e) {
		editor.updateShape<PreviewShape>({
			id: shapeID,
			type: 'preview',
			props: {
				html: originalHTML,
				uploadedShapeId: shapeID,
			},
		})
		throw e
	}
}
