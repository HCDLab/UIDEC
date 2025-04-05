import { Editor, createShapeId } from '@tldraw/tldraw'

import { PreviewShape } from '../PreviewShape/PreviewShape'
import { getHtmlFromOpenAI } from './getHtmlFromOpenAI'

type MeasureResult = {
	width: number
	height: number
}

// Improved function to get document height with more accurate measurements
function getDocumentMaxHeight(document: Document, minHeight: number) {
	const body = document.body
	const html = document.documentElement
	
	// Get all visible elements
	const allElements = document.querySelectorAll('body *');
	let maxElementBottom = 0;
	
	// Find the bottom-most visible element
	allElements.forEach(el => {
		const rect = el.getBoundingClientRect();
		const bottom = rect.bottom + window.scrollY;
		if (bottom > maxElementBottom && rect.height > 0 && rect.width > 0) {
			maxElementBottom = bottom;
		}
	});
	
	return Math.max(
		minHeight,
		body.scrollHeight,
		body.offsetHeight,
		html.clientHeight,
		html.scrollHeight,
		html.offsetHeight,
		maxElementBottom + 20 // Add padding to the bottom
	)
}

// Improved HTML measurement with timeout and error handling
function measureHTML(
	html: string,
	fixedWidth: number,
	minHeight: number,
	timeout: number = 3000
): Promise<{ width: number; height: number }> {
	return new Promise<{ width: number; height: number }>((resolve, reject) => {
		const iframe = document.createElement('iframe');
		iframe.style.position = 'absolute';
		iframe.style.top = '-9999px';
		iframe.style.width = `${fixedWidth}px`;
		iframe.style.height = `${minHeight}px`;
		iframe.style.border = 'none';
		document.body.appendChild(iframe);

		// Set a timeout to prevent hanging on problematic HTML
		const timeoutId = setTimeout(() => {
			document.body.removeChild(iframe);
			resolve({ width: fixedWidth, height: minHeight });
		}, timeout);

		const checkIframeContent = () => {
			try {
				const iframeDocument = iframe.contentDocument;
				if (iframeDocument && iframeDocument.body) {
					iframeDocument.body.style.width = `${fixedWidth}px`;
					iframeDocument.body.style.height = 'auto';
					iframeDocument.body.style.overflow = 'auto';

					// Give time for any scripts to execute and possibly modify layout
					setTimeout(() => {
						try {
							const width = iframeDocument.body.scrollWidth;
							const height = getDocumentMaxHeight(iframeDocument, minHeight);
							
							clearTimeout(timeoutId);
							resolve({ width, height });
							
							// Remove iframe after a short delay to ensure proper measurements
							setTimeout(() => {
								if (document.body.contains(iframe)) {
									document.body.removeChild(iframe);
								}
							}, 100);
						} catch (err) {
							clearTimeout(timeoutId);
							document.body.removeChild(iframe);
							resolve({ width: fixedWidth, height: minHeight });
						}
					}, 300);
				} else {
					setTimeout(checkIframeContent, 100);
				}
			} catch (err) {
				clearTimeout(timeoutId);
				if (document.body.contains(iframe)) {
					document.body.removeChild(iframe);
				}
				resolve({ width: fixedWidth, height: minHeight });
			}
		};

		iframe.onload = () => {
			try {
				const iframeDocument = iframe.contentDocument;
				if (iframeDocument) {
					iframeDocument.open();
					iframeDocument.write(html);
					iframeDocument.close();
					checkIframeContent();
				} else {
					clearTimeout(timeoutId);
					document.body.removeChild(iframe);
					resolve({ width: fixedWidth, height: minHeight });
				}
			} catch (err) {
				clearTimeout(timeoutId);
				if (document.body.contains(iframe)) {
					document.body.removeChild(iframe);
				}
				resolve({ width: fixedWidth, height: minHeight });
			}
		};

		iframe.onerror = () => {
			clearTimeout(timeoutId);
			if (document.body.contains(iframe)) {
				document.body.removeChild(iframe);
			}
			resolve({ width: fixedWidth, height: minHeight });
		};
	});
}

const deviceDimensions: { [key: string]: { width: number; aspectRatio: number } } = {
	Desktop: { width: 1920, aspectRatio: 16 / 9 },
	Tablet: { width: 768, aspectRatio: 4 / 3 },
	Mobile: { width: 425, aspectRatio: 9 / 16 },
};

// Improved HTML sanitization with better handling of problematic content
function sanitizeHtml(html: string): string {
	try {
		// Check if HTML is valid first
		if (!html || html.trim().length < 100) {
			console.warn("HTML content is too short or empty");
			return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body><div style="display:flex;justify-content:center;align-items:center;height:100vh;font-family:sans-serif;">
Error: Invalid HTML content generated</div></body>
</html>`;
		}
		
		// Start with basic sanitization
		let sanitized = html
			// Remove any large image data URLs to improve performance
			.replace(/data:image\/[^;]+;base64,[a-zA-Z0-9+/]+=*/g, (match) => {
				if (match.length > 10000) { // Limit large data URLs
					return 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2YwZjBmMCIvPjwvc3ZnPg==';
				}
				return match;
			})
			// Ensure the HTML has proper structure
			.replace(/<html[^>]*>/i, '<html>');
			
		// Ensure viewport meta tag is present
		if (!sanitized.includes('<meta name="viewport"')) {
			sanitized = sanitized.replace('<head>', '<head><meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">');
		}
		
		// Ensure charset is specified
		if (!sanitized.includes('charset=')) {
			sanitized = sanitized.replace('<head>', '<head><meta charset="UTF-8">');
		}
		
		// Add error handling script to catch problems with rendering
		sanitized = sanitized.replace('</body>', `
<script>
window.onerror = function(msg, url, line) {
	console.error("Error in generated HTML:", msg, "at line:", line);
	return true; // Prevents default error handling
};
document.body.dispatchEvent(new Event('content-ready'));
</script>
</body>`);
		
		return sanitized;
	} catch (error) {
		console.error("Error sanitizing HTML:", error);
		return html; // Return original if sanitization fails
	}
}

export async function makeReal(
	editor: Editor,
	designSpecs?: string,
	systemPrompt?: string,
	userPrompt?: string,
	specificationPrompt?: string,
	UIScreensPrompt?: string,
	max_tokens?: number,
	temperature?: number,
	model?: string,
	UIScreens?: any,
	settings?: any,
	provider?: string
) {
	const center = editor.getViewportScreenCenter();
	const device = settings?.device?.value || 'Desktop';
	const { width: fixedWidth, aspectRatio } = deviceDimensions[device] || deviceDimensions.Desktop;
	let fixedHeight = fixedWidth / aspectRatio;

	const bounds = editor.getCurrentPageBounds();
	const newShapeId = createShapeId();

	// Create temporary shape with loading state
	try {
		// Position based on current bounds or center
		const initialX = bounds && bounds.x ? bounds.width + bounds.x + 300 : center.x - fixedWidth / 2;
		const initialY = bounds && bounds.y ? bounds.y : center.y - fixedHeight / 2;
		
		// Create initial shape
		editor.createShape<PreviewShape>({
			id: newShapeId,
			type: 'preview',
			x: initialX,
			y: initialY,
			props: {
				html: '',  // Start with empty HTML
				settings: settings,
				w: fixedWidth,
				h: fixedHeight,
				version: 0,
				history: [],
				source: 'loading', // Mark as loading
				renderingMode: 'normal',
			},
		});
		
		// Select the shape to show the user something is happening
		editor.select(newShapeId);
		editor.zoomToSelection();

		// Get HTML from LLM
		const json = await getHtmlFromOpenAI({
			text: designSpecs ?? '',
			systemPrompt,
			userPrompt,
			specificationPrompt,
			UIScreensPrompt,
			max_tokens,
			temperature,
			model,
			UIScreens: UIScreens || { data: [] },
			provider,
		});

		if (!json) {
			throw Error('Could not contact AI provider.');
		}

		if (json?.error) {
			throw Error(`${json.error.message?.slice(0, 128)}...`);
		}

		// Extract HTML from the response
		const message = json.choices[0].message.content;
		if (!message) {
			throw Error('Empty response content from AI provider');
		}

		// Log the raw response for debugging complex formats
		console.log("Raw response format (first 200 chars):", message.substring(0, 200) + "...");

		// More robust HTML extraction
		let html = '';

		// Case 1: Check for complex format with metadata and code blocks
		// This handles formats like: 0:["$@1",["development",null]] 2:T486e,```html <!DOCTYPE html>...
		const complexFormatRegex = /.*?```(?:html|HTML)?\s*(<!DOCTYPE html>[\s\S]*?)(?:```|(?:\d+:{"choices"|$))/;
		const complexMatch = message.match(complexFormatRegex);

		if (complexMatch && complexMatch[1]) {
			console.log("Found HTML in complex format with metadata");
			html = complexMatch[1];
		}
		// Case 2: Check for standard markdown code blocks
		else {
			const markdownHtmlRegex = /```(?:html|HTML)?\s*(<!DOCTYPE html>[\s\S]*?<\/html>)\s*```/;
			const markdownMatch = message.match(markdownHtmlRegex);

			if (markdownMatch && markdownMatch[1]) {
				console.log("Found HTML in markdown code block");
				html = markdownMatch[1];
			} else {
				// Case 3: Regular HTML extraction
				const doctypeIndex = message.indexOf('<!DOCTYPE html>');
				const htmlStartIndex = doctypeIndex !== -1 ? doctypeIndex : message.indexOf('<html');
				const htmlEndIndex = message.lastIndexOf('</html>');

				if (htmlStartIndex !== -1 && htmlEndIndex !== -1) {
					html = message.substring(htmlStartIndex, htmlEndIndex + '</html>'.length);
				} else {
					// Case 4: Search for body content
					const bodyStartRegex = /<body[^>]*>/i;
					const bodyEndRegex = /<\/body>/i;
					const bodyStartMatch = message.match(bodyStartRegex);
					const bodyEndMatch = message.match(bodyEndRegex);
					
					if (bodyStartMatch && bodyEndMatch) {
						// Found body tags but not complete HTML
						const bodyContent = message.substring(
							bodyStartMatch.index + bodyStartMatch[0].length,
							bodyEndMatch.index
						);
						
						html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body>${bodyContent}</body>
</html>`;
					} else {
						// Case 5: No HTML structure found, check for common content patterns
						const contentStartIndex = message.indexOf('<div');
						const hasHtmlContent = contentStartIndex !== -1 || message.includes('<p') || message.includes('<section');
						
						if (hasHtmlContent) {
							// Looks like HTML content without proper structure
							html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body>${message}</body>
</html>`;
						} else {
							// Fallback: Plain text or unknown format
							console.warn('No HTML structure found in response, attempting to reconstruct');
							html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body><div style="font-family:sans-serif;padding:20px;">${message}</div></body>
</html>`;
						}
					}
				}
			}
		}

		// Log the first 100 chars of extracted HTML for debugging
		console.log("Extracted HTML start:", html.substring(0, 100) + "...");

		if (html.length < 100) {
			console.warn("HTML content too short:", message);
			throw Error('Could not generate a valid design. The HTML content is too small.');
		}

		// Sanitize HTML for better performance and reliability
		html = sanitizeHtml(html);

		// Measure HTML dimensions with improved error handling
		try {
			let updatedHeight = fixedHeight;
			
			if (device === 'Desktop') {
				const { height } = await Promise.race<MeasureResult>([
					measureHTML(html, fixedWidth, fixedHeight, 3000),
					new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000)),
				]).catch((err) => {
					console.warn('HTML measurement timed out or failed:', err);
					return { width: fixedWidth, height: fixedHeight };
				});
				
				updatedHeight = height;
			}

			// Step 1: First update with HTML but keep source as loading
			editor.updateShape<PreviewShape>({
				id: newShapeId,
				type: 'preview',
				props: {
					html,
					source: 'loading',
					w: fixedWidth,
					h: updatedHeight,
				},
			});
			
			// Step 2: After a small delay, update with final state to trigger rendering
			setTimeout(() => {
				editor.updateShape<PreviewShape>({
					id: newShapeId,
					type: 'preview',
					props: {
						html,
						history: [html],
						version: 0,
						w: fixedWidth,
						h: updatedHeight,
						uploadedShapeId: newShapeId,
						source: 'api', // Mark as coming from API
					},
				});
				
				// Re-select to ensure it's visible
				editor.select(newShapeId);
			}, 300);
		} catch (e) {
			console.error('Error measuring or updating HTML:', e);
			
			// Fallback update even if measurement fails
			editor.updateShape<PreviewShape>({
				id: newShapeId,
				type: 'preview',
				props: {
					html,
					history: [html],
					version: 0,
					uploadedShapeId: newShapeId,
					source: 'api',
				},
			});
		}
	} catch (e) {
		// Clean up on error
		try {
			editor.deleteShape(newShapeId);
		} catch (deleteError) {
			console.error('Error deleting shape during error handling:', deleteError);
		}
		throw e;
	}
}
