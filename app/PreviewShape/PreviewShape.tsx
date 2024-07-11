/* eslint-disable react-hooks/rules-of-hooks */
import { ReactElement, useEffect, useState} from 'react'
import {
	BaseBoxShapeUtil,
	DefaultSpinner,
	HTMLContainer,
	SvgExportContext,
	TLBaseShape,
	TLShapeUtilCanBindOpts,
	Vec,
	toDomPrecision,
	useIsEditing,
	useValue
} from 'tldraw'
import {  } from '../components/Dropdown'
import { stopEventPropagation } from '@tldraw/tldraw'
import { CircleX, Download, Heart, Info} from 'lucide-react'
import DeleteConfirmationDialog from '../Dialog/Delete'
import SaveDialog from '../Dialog/Save'
import DesignSpecs  from '../Dialog/DesignSpec'

export type PreviewShape = TLBaseShape<
	'preview',
	{
		html: string
		source: string
		w: number
		h: number
		uploadedShapeId?: string
		dateCreated?: number,
		settings?: any
	}
>

export class PreviewShapeUtil extends BaseBoxShapeUtil<PreviewShape> {
	static override type = 'preview' as const

	getDefaultProps(): PreviewShape['props'] {
		return {
			html: '',
			source: '',
			w: (960),
			h: (540) ,
			dateCreated: Date.now(),

		}
	}

	override canEdit = () => true
	override isAspectRatioLocked = (_shape: PreviewShape) => false
	override canResize = (_shape: PreviewShape) => true
	override canBind = (_opts: TLShapeUtilCanBindOpts<PreviewShape>) => false

	override component(shape: PreviewShape) {
		const isEditing = useIsEditing(shape.id)
		const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
		const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
		const [isSpecsDialogOpen, setIsSpecsDialogOpen] = useState(false);

		const handleDeleteClick = (e: React.PointerEvent) => {
			stopEventPropagation(e);
			setIsDeleteDialogOpen(true);
			setIsSaveDialogOpen(false);
			setIsSpecsDialogOpen(false);
		};

		const handleConfirmDelete: () => void = () => {
			setIsDeleteDialogOpen(false);
			this.editor.deleteShape(shape.id);
		};

		const handleCancelDelete = () => {
			setIsDeleteDialogOpen(false);
		};

		const handleSaveClick = (e: React.PointerEvent) => {
			stopEventPropagation(e);
			setIsSaveDialogOpen(true);
			setIsDeleteDialogOpen(false);
			setIsSpecsDialogOpen(false);
		}

		const handleConfirmSave = () => {
			setIsSaveDialogOpen(false);
		}

		const handleCancelSave = () => {
			setIsSaveDialogOpen(false);
		}

		const handleShowSpecs = (e: React.PointerEvent) => {
			stopEventPropagation(e);
			setIsSpecsDialogOpen(true);
			setIsDeleteDialogOpen(false);
			setIsSaveDialogOpen(false);
		}

		const handleHideSpecs = () => {
			setIsSpecsDialogOpen(false);
		} 

		const handleExportDesign = async (e: React.PointerEvent, htmlString: string) => {
			stopEventPropagation(e);
			// open new tab with the design
			const blob = new Blob([htmlString], { type: 'text/html' });
			const url = URL.createObjectURL(blob);
			const a = document.createElement
			('a');
			a.href = url;
			a.download = 'design.html';
			a.click();
			URL.revokeObjectURL(url);
		}
			
		
		const boxShadow = useValue(
			'box shadow',
			() => {
				const rotation = this.editor.getShapePageTransform(shape)!.rotation()
				return getRotatedBoxShadow(rotation)
			},
			[this.editor]
		)
		const { html, uploadedShapeId } = shape.props
		// upload the html if we haven't already:
		useEffect(() => {
			let isCancelled = false
			if (html && (uploadedShapeId !== shape.id)) {
				; (async () => {
					if (isCancelled) return
					this.editor.updateShape<PreviewShape>({
						id: shape.id,
						type: 'preview',
						props: {
							uploadedShapeId: shape.id,
						},
					})
				})()
			}
			return () => {
				isCancelled = true
			}
		}, [shape.id, html, uploadedShapeId])

		const isLoading =  uploadedShapeId !== shape.id

		const isOnlySelected = useValue(
			'is only selected',
			() => this.editor.getOnlySelectedShapeId() === shape.id,
			[shape.id, this.editor]
		)



		// Kind of a hack—we're preventing users from pinching-zooming into the iframe
		const htmlToUse = shape.props.html.replace(
			`</body>`,
			`<script src="https://unpkg.com/html2canvas"></script><script>
			// send the screenshot to the parent window
  			window.addEventListener('message', function(event) {
    		if (event.data.action === 'take-screenshot' && event.data.shapeid === "${shape.id}") {
      		html2canvas(document.body, {useCors : true}).then(function(canvas) {
        		const data = canvas.toDataURL('image/png');
        		window.parent.postMessage({screenshot: data, shapeid: "${shape.id}"}, "*");
      		});
    		}
  			}, false);
			document.body.addEventListener('wheel', e => { if (!e.ctrlKey) return; e.preventDefault(); return }, { passive: false })</script>
</body>`
		)

		return (
			<HTMLContainer className="tl-embed-container" id={shape.id}>
				{isLoading ? (
					<div
						style={{
							width: '100%',
							height: '100%',
							backgroundColor: 'var(--color-culled)',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							boxShadow,
							border: '1px solid var(--color-panel-contrast)',
							borderRadius: 'var(--radius-2)',
						}}
					>
						<DefaultSpinner />
					</div>
				) : (
					<>
						<iframe
							id={`iframe-1-${shape.id}`}
							srcDoc={htmlToUse}
							width={toDomPrecision(shape.props.w)}
							height={toDomPrecision(shape.props.h)}
							draggable={false}
							style={{
								backgroundColor: 'var(--color-panel)',
								pointerEvents: isEditing ? 'auto' : 'none',
								boxShadow,
								border: '1px solid var(--color-panel-contrast)',
								borderRadius: 'var(--radius-2)',
							}}
						/>
						<div
							style={{
								textAlign: 'center',
								position: 'absolute',
								bottom: isEditing ? -40 : 0,
								padding: 4,
								fontFamily: 'inherit',
								fontSize: 12,
								left: 0,
								width: '100%',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								pointerEvents: 'none',
							}}
						>
						
							<span
								style={{
									background: 'var(--color-panel)',
									padding: '4px 12px',
									borderRadius: 99,
									border: '1px solid var(--color-muted-1)',
								}}
							>
								{isEditing ? 'Click the canvas to exit' : 'Double click to interact'}
							</span>
						</div>
						{isOnlySelected && (
								<div
									style={{
										all: 'unset',
										position: 'absolute',
										top: -120,
										right: "0",
										height: 100,
										width: 320,
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										cursor: 'pointer',
										pointerEvents: 'all',
									}}
								>
									<div className="bg-white text-xl p-4 space-x-2   rounded-2xl shadow-lg flex items-center">
										<button className="p-2" onPointerDown={handleDeleteClick}>
											<CircleX className='w-12 h-12' />
										</button>
										<button className="p-2" onPointerDown={handleSaveClick}>
											<Heart className='w-12 h-12' />
										</button>
										<button className="p-2" onPointerDown={ e => handleExportDesign(e, html)}>
											<Download className='w-12 h-12' />
										</button>
										<button className="p-2" onPointerDown={handleShowSpecs}>
											<Info className='w-12 h-12' />
										</button>
									</div>
									{isDeleteDialogOpen && (
										<DeleteConfirmationDialog
											stopEventPropagation={stopEventPropagation}
											onConfirm={handleConfirmDelete}
											onCancel={handleCancelDelete}
										/>
									)}
									{isSaveDialogOpen && (
										<SaveDialog
											stopEventPropagation={stopEventPropagation}
											onConfirm={handleConfirmSave}
											onCancel={handleCancelSave}
										/>
									)}
									{isSpecsDialogOpen && (
										<DesignSpecs
											stopEventPropagation={stopEventPropagation}
											onCancel={handleHideSpecs}
											settings={shape.props.settings}
										/>
									)}
								</div>
								
							)}
					</>
				)}
			</HTMLContainer>
		)
	}

	override toSvg(shape: PreviewShape, _ctx: SvgExportContext) {
		// while screenshot is the same as the old one, keep waiting for a new one
		return new Promise<ReactElement>((resolve, reject) => {
			if (window === undefined) {
				reject()
				return
			}

			const windowListener = (event: MessageEvent) => {
				if (event.data.screenshot && event.data?.shapeid === shape.id) {
					window.removeEventListener('message', windowListener)
					clearTimeout(timeOut)

					resolve(<PreviewImage href={event.data.screenshot} shape={shape} />)
				}
			}
			const timeOut = setTimeout(() => {
				reject()
				window.removeEventListener('message', windowListener)
			}, 2000)
			window.addEventListener('message', windowListener)
			//request new screenshot
			const firstLevelIframe = document.getElementById(`iframe-1-${shape.id}`) as HTMLIFrameElement
			if (firstLevelIframe) {
				//@ts-ignore
				firstLevelIframe.contentWindow.postMessage(
					{ action: 'take-screenshot', shapeid: shape.id },
					'*'
				)
			} else {
				console.log('first level iframe not found or not accessible')
			}
		})
	}

	indicator(shape: PreviewShape) {
		return <rect width={shape.props.w} height={shape.props.h} />
	}
}

const ROTATING_BOX_SHADOWS = [
	{
		offsetX: 0,
		offsetY: 2,
		blur: 4,
		spread: -1,
		color: '#0000003a',
	},
	{
		offsetX: 0,
		offsetY: 3,
		blur: 12,
		spread: -2,
		color: '#0000001f',
	},
]

function getRotatedBoxShadow(rotation: number) {
	const cssStrings = ROTATING_BOX_SHADOWS.map((shadow) => {
		const { offsetX, offsetY, blur, spread, color } = shadow
		const vec = new Vec(offsetX, offsetY)
		const { x, y } = vec.rot(-rotation)
		return `${x}px ${y}px ${blur}px ${spread}px ${color}`
	})
	return cssStrings.join(', ')
}

function PreviewImage({ shape, href }: { shape: PreviewShape; href: string }) {
	return <image href={href} width={shape.props.w.toString()} height={shape.props.h.toString()} />
}
