/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useState } from 'react';
import {
	BaseBoxShapeUtil,
	DefaultSpinner,
	HTMLContainer,
	TLBaseShape,
	TLShapeUtilCanBindOpts,
	Vec,
	toDomPrecision,
	useIsEditing,
	useValue
} from 'tldraw';
import { stopEventPropagation } from '@tldraw/tldraw';
import { ArrowLeftSquareIcon, ArrowRightSquareIcon, CircleX, Copy, Download, Edit, Heart, Info } from 'lucide-react';
import DeleteConfirmationDialog from '../Dialog/Delete';
import SaveDialog from '../Dialog/Save';
import DesignSpecs from '../Dialog/DesignSpec';
import ModifyComponent from '../Dialog/Modify';

export type PreviewShape = TLBaseShape<
	'preview',
	{
		html: string;
		version: number;
		history: any[];
		source: string;
		w: number;
		h: number;
		uploadedShapeId?: string;
		dateCreated?: number;
		settings?: any;
	}
>;

export class PreviewShapeUtil extends BaseBoxShapeUtil<PreviewShape> {
	static override type = 'preview' as const;

	getDefaultProps(): PreviewShape['props'] {
		return {
			html: '',
			source: '',
			w: 960,
			h: 540,
			version: 0,
			history: [],
			dateCreated: Date.now(),
		};
	}

	override canEdit = () => true;
	override isAspectRatioLocked = (_shape: PreviewShape) => false;
	override canResize = (_shape: PreviewShape) => true;
	override canBind = (_opts: TLShapeUtilCanBindOpts<PreviewShape>) => false;

	override component(shape: PreviewShape) {
		const isEditing = useIsEditing(shape.id);
		const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
		const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
		const [isSpecsDialogOpen, setIsSpecsDialogOpen] = useState(false);
		const [selectedElement, setSelectedElement] = useState(null);
		const [selectedAction, setSelectedAction] = useState<null | 'delete' | 'duplicate' | 'edit' | 'save' | 'export' | 'specs'>(null);

		const handleDeleteClick = (e: React.PointerEvent) => {
			stopEventPropagation(e);
			setIsDeleteDialogOpen(true);
			setIsSaveDialogOpen(false);
			setIsSpecsDialogOpen(false);
			setSelectedAction('delete');
		};

		const handleConfirmDelete = () => {
			setIsDeleteDialogOpen(false);
			this.editor.deleteShape(shape.id);
		};

		const handleCancelDelete = () => {
			setIsDeleteDialogOpen(false);
			setSelectedAction(null);
		};

		const handleSaveClick = (e: React.PointerEvent) => {
			stopEventPropagation(e);
			setIsSaveDialogOpen(true);
			setIsDeleteDialogOpen(false);
			setIsSpecsDialogOpen(false);
			setSelectedAction('save');
		};

		const handleConfirmSave = () => {
			setIsSaveDialogOpen(false);
		};

		const handleCancelSave = () => {
			setIsSaveDialogOpen(false);
		};

		const handleShowSpecs = (e: React.PointerEvent) => {
			stopEventPropagation(e);
			setIsSpecsDialogOpen(true);
			setIsDeleteDialogOpen(false);
			setIsSaveDialogOpen(false);
			setSelectedAction('specs');
		};

		const handleHideSpecs = () => {
			setIsSpecsDialogOpen(false);
			setSelectedAction(null);
			
		};

		const handleEdit = (e: React.PointerEvent) => {
			stopEventPropagation(e);
			this.editor.setEditingShape(shape.id);
			setSelectedAction('edit');
		}

		const handleDuplicate = () => {
			this.editor.duplicateShapes([shape.id], { x: shape.props.w + 300, y: 0 });
			setSelectedAction('duplicate');
		};

		const handleExportDesign = async (e: React.PointerEvent, htmlString: string) => {
			stopEventPropagation(e);
			const blob = new Blob([htmlString], { type: 'text/html' });
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = 'design.html';
			a.click();
			URL.revokeObjectURL(url);
			setSelectedAction('export');
		};

		const historyNext = (e: React.PointerEvent) => {
			stopEventPropagation(e);
			const { history, version } = shape.props;
			if (!history || version == undefined || version == null) return;
			if (version < history.length - 1) {
				this.editor.updateShape<PreviewShape>({
					id: shape.id,
					type: 'preview',
					props: {
						version: version + 1,
						html: history[version + 1],
					},
				});
			}
		}

		const historyPrev = (e: React.PointerEvent) => {
			stopEventPropagation(e);
			const { history, version } = shape.props;
			if (!history || version == undefined || version == null) return;
			if (version > 0) {
				this.editor.updateShape<PreviewShape>({
					id: shape.id,
					type: 'preview',
					props: {
						version: version - 1,
						html: history[version - 1],
					},
				});
			}
		}

		const boxShadow = useValue(
			'box shadow',
			() => {
				const rotation = this.editor.getShapePageTransform(shape).rotation();
				return getRotatedBoxShadow(rotation);
			},
			[this.editor]
		);

		const { html, uploadedShapeId } = shape.props;
		useEffect(() => {
			let isCancelled = false;
			if (html && uploadedShapeId !== shape.id) {
				(async () => {
					if (isCancelled) return;
					this.editor.updateShape<PreviewShape>({
						id: shape.id,
						type: 'preview',
						props: {
							uploadedShapeId: shape.id,
							version: shape.props.version ? Math.min(shape.props.version, shape.props.history.length - 1) : 0,
							history: shape.props.history,
						},
					});
				})();
			}
			return () => {
				isCancelled = true;
			};
		}, [shape.id, html, uploadedShapeId]);

		const isLoading = uploadedShapeId !== shape.id;

		const isOnlySelected = useValue(
			'is only selected',
			() => this.editor.getOnlySelectedShapeId() === shape.id,
			[shape.id, this.editor]
		);

		useEffect(() => {
			if (!isOnlySelected) {
				setSelectedElement(null);
				setSelectedAction(null);
			}
		}, [isOnlySelected]);

		const htmlToUse = shape.props.html.replace(
			`</body>`,
			`<script src="https://unpkg.com/html2canvas"></script><script>
			let selectedElement = null;

			function createMask(element) {
				const mask = document.createElement('div');
				mask.style.position = 'absolute';
				mask.style.top = element.offsetTop + 'px';
				mask.style.left = element.offsetLeft + 'px';
				mask.style.width = element.offsetWidth + 'px';
				mask.style.height = element.offsetHeight + 'px';
				mask.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
				mask.style.pointerEvents = 'none';
				mask.classList.add('hover-mask');
				document.body.appendChild(mask);
			}

			function removeMask() {
				const masks = document.querySelectorAll('.hover-mask');
				masks.forEach(mask => mask.remove());
			}

			document.body.addEventListener('click', function(event) {
				event.preventDefault();
				removeMask();
				selectedElement = event.target;
				createMask(selectedElement);
				const elementData = {
				tagName: selectedElement.tagName,
				outerHTML: selectedElement.outerHTML,
				innerHTML: selectedElement.innerHTML,
				attributes: Array.from(selectedElement.attributes).map(attr => ({
					name: attr.name,
					value: attr.value,
				}))
				};
				window.parent.postMessage({ action: 'element-selected', shapeid: '${shape.id}', elementData }, '*');
			});

			document.body.addEventListener('wheel', e => { if (!e.ctrlKey) return; e.preventDefault(); return }, { passive: false });
			window.addEventListener('message', function(event) {
				if (event.data.action === 'take-screenshot' && event.data.shapeid === "${shape.id}") {
					html2canvas(document.body, {useCors : true}).then(function(canvas) {
						const data = canvas.toDataURL('image/png');
						window.parent.postMessage({screenshot: data, shapeid: "${shape.id}"}, "*");
					});
				}
			
			}, false);

			window.addEventListener('message', function(event) {
				console.log('message received', event.data);	
			});
			</script></body>`
		);

		useEffect(() => {
			const handleMessage = (event: MessageEvent) => {
				if (event.data.action === 'element-selected' && event.data.shapeid === shape.id) {
					setSelectedElement(event.data.elementData);
				}
			};

			window.addEventListener('message', handleMessage);
			return () => {
				window.removeEventListener('message', handleMessage);
			};
		}, [shape.id]);

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
							<div
								style={{
									textAlign: 'center',
									position: 'absolute',
									bottom: -100,
									fontFamily: 'inherit',
									left: 0,
									width: '100%',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
								}}
							>
								{shape.props?.history && shape.props?.history.length > 1 && (
									<div className="bg-white text-xl p-4 space-x-2 rounded-2xl shadow-lg flex items-center"
									>
										<button className="p-2" onPointerDown={historyPrev}>
											<ArrowLeftSquareIcon className='w-12 h-12' />
										</button>
										<span className="text-xl font-bold text-black"> {shape.props.version + 1}/{shape.props.history?.length} </span>
										<button className="p-2" onPointerDown={historyNext}>
											<ArrowRightSquareIcon className='w-12 h-12' />
										</button>
									</div>
								)}
						</div>
						{isOnlySelected && (
							<>
								<div
									style={{
										all: 'unset',
										position: 'absolute',
										top: -150,
										right: 40,
										height: 100,
										width: 320,
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										cursor: 'pointer',
										pointerEvents: 'all',
									}}
								>
									<div className="bg-white text-xl p-4 space-x-2 rounded-2xl shadow-lg flex items-center">
										<button className={`p-2 ${selectedAction === 'delete' ? 'bg-blue-100' : ''}`}onPointerDown={handleDeleteClick}>
											<CircleX className='w-12 h-12' />
										</button>
										<button className={`p-2 ${selectedAction === 'duplicate' ? 'bg-blue-100' : ''}`}
										onPointerDown={handleDuplicate}>
											<Copy className='w-12 h-12' />
										</button>
										<button className={`p-2 ${selectedAction === 'edit' ? 'bg-blue-100' : ''}`}
										onPointerDown={handleEdit}>
											<Edit className='w-12 h-12' />
										</button>
										<button className={`p-2 ${selectedAction === 'save' ? 'bg-blue-100' : ''}`}
										onPointerDown={handleSaveClick}>
											<Heart className='w-12 h-12' />
										</button>
										<button className={`p-2 ${selectedAction === 'export' ? 'bg-blue-100' : ''}`}
										onPointerDown={e => handleExportDesign(e, html)}>
											<Download className='w-12 h-12' />
										</button>
										<button className={`p-2 ${selectedAction === 'specs' ? 'bg-blue-100' : ''}`}
										onPointerDown={handleShowSpecs}>
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
											design={this.editor.getShape(shape.id)}
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
							</>
						)}
						{isOnlySelected && selectedElement && (
							<div
								style={{
									position: 'absolute',
									top: 0,
									right: -340,
									height: 100,
									width: 320,
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									cursor: 'pointer',
									pointerEvents: 'all',
								}}
							>
								<ModifyComponent
									editor={this.editor}
									stopEventPropagation={stopEventPropagation}
									selectedElement={selectedElement}
									shapeID={shape.id}
									originalHTML={shape.props.html}
								/>
							</div>
						)}
					</>
				)}
			</HTMLContainer>
		);
	}

	indicator(shape: PreviewShape) {
		return <rect width={shape.props.w} height={shape.props.h} />;
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
];

function getRotatedBoxShadow(rotation: number) {
	const cssStrings = ROTATING_BOX_SHADOWS.map((shadow) => {
		const { offsetX, offsetY, blur, spread, color } = shadow;
		const vec = new Vec(offsetX, offsetY);
		const { x, y } = vec.rot(-rotation);
		return `${x}px ${y}px ${blur}px ${spread}px ${color}`;
	});
	return cssStrings.join(', ');
}
