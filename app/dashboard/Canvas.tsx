'use client';

import 'tldraw/tldraw.css'

import { ArrowDownSquare, ArrowUpSquare, Edit3, RedoDot, Settings, UndoDot } from 'lucide-react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DefaultContextMenu, Editor, TLUiContextMenuProps, Tldraw, TldrawUiMenuGroup, getSnapshot } from '@tldraw/tldraw';
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { OPENAI_SPECIFICATION_PROMPT, OPENAI_UISCREENS_PROMPT, OPENAI_USER_PROMPT, OPEN_AI_SYSTEM_PROMPT } from '../prompt';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import Config from '../components/Config';
import { Input } from '@/components/ui/input';
import { PreviewShapeUtil } from '../PreviewShape/PreviewShape'
import Sidebar from '../Sidebar/Sidebar';
import pb from '@/client/pocketBase';
import { toast } from 'sonner';
import {
	useQueryClient
} from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation';

// Performance settings for Canvas rendering
interface PerformanceSettings {
	useVirtualization: boolean;
	optimizedRendering: boolean;
	limitAnimations: boolean;
}

const SaveButton = ({ name, userId, editor, settings }: {
	name: string,
	userId: string,
	editor: Editor | null,
	settings: any
}) => {
	
   const queryClient = useQueryClient()
   const [isSaving, setIsSaving] = useState(false);
   
	if (!editor) return null;

	const saveCanvas = async () => {
		setIsSaving(true);
		try {
			const { document, session } = getSnapshot(editor.store);
			localStorage.setItem(`design_inspo`, JSON.stringify(document));
			localStorage.setItem(`design_inspo_${userId}`, JSON.stringify(session));
			await pb.collection('saved_canvas').create({
				user_id: userId,
				canvas: document,
				name: name,
				settings,
				session
			});
			toast.success('Canvas saved successfully', {
				duration: 3000,
			});
			queryClient.invalidateQueries({ queryKey: ['saved_canvas'] });
		} catch (error) {
			console.error('Error saving canvas:', error);
			toast.error('Failed to save canvas', {
				duration: 3000,
			});
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<Button onClick={saveCanvas} className="" disabled={isSaving}>
			{isSaving ? 'Saving Canvas...' : 'Save Canvas'}
		</Button>
	);
};

const CanvasName = ({
	canvasName,
	setCanvasName
}:{
	setCanvasName: (name: string) => void,
	canvasName: string
}
) => {
	const [isEditing, setIsEditing] = useState(false);
	const [text, setText] = useState(canvasName);

	const handleBlur = () => {
		setIsEditing(false);
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setText(e.target.value);
		setCanvasName(e.target.value);
	};

	return (
		<div onClick={() => setIsEditing(true)} className="flex flex-col item-center text-center">
			{isEditing ? (
				<Input
					type="text"
					value={text}
					onChange={handleChange}
					onBlur={handleBlur}
					autoFocus
				/>
			) : (
				<Tooltip>
					<TooltipTrigger asChild>
							<span className="text-gray-600 font-semibold">{text} <Edit3 className="h-4 w-4 inline-block" /></span>
					</TooltipTrigger>
					<TooltipContent style={{
						zIndex:9999
					}}>
					<p>Click to edit canvas name</p>
					</TooltipContent>
				</Tooltip>
			)}
		</div>
	);
};

// Create a custom context menu with performance options
function CustomContextMenu(props: TLUiContextMenuProps) {
	return (
		<DefaultContextMenu {...props}>
			<TldrawUiMenuGroup id="example">
				<></>
			</TldrawUiMenuGroup>
		</DefaultContextMenu>
	)
}

// Canvas settings component
const CanvasSettings = ({ 
	performanceSettings, 
	setPerformanceSettings 
}: { 
	performanceSettings: PerformanceSettings, 
	setPerformanceSettings: React.Dispatch<React.SetStateAction<PerformanceSettings>> 
}) => {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size="icon">
					<Settings className="h-4 w-4" />
					<span className="sr-only">Canvas Settings</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuLabel>Canvas Settings</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuLabel className="text-xs font-normal text-muted-foreground">Performance</DropdownMenuLabel>
				<DropdownMenuCheckboxItem
					checked={performanceSettings.useVirtualization}
					onCheckedChange={(checked) => 
						setPerformanceSettings(prev => ({ ...prev, useVirtualization: checked }))
					}
				>
					Virtualize Components
				</DropdownMenuCheckboxItem>
				<DropdownMenuCheckboxItem
					checked={performanceSettings.optimizedRendering}
					onCheckedChange={(checked) => 
						setPerformanceSettings(prev => ({ ...prev, optimizedRendering: checked }))
					}
				>
					Optimize Rendering
				</DropdownMenuCheckboxItem>
				<DropdownMenuCheckboxItem
					checked={performanceSettings.limitAnimations}
					onCheckedChange={(checked) => 
						setPerformanceSettings(prev => ({ ...prev, limitAnimations: checked }))
					}
				>
					Limit Animations
				</DropdownMenuCheckboxItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default function Canvas() {
	const [user, setUser] = useState<any>(null);
	const [editor, setEditor] = useState<Editor | null>(null)
	const [savedEditor, setSavedEditor] = useState<Editor | null>(null)
	const [favoriteEditor, setFavoriteEditor] = useState<Editor | null>(null)
	const [systemPrompt, setSystemPrompt] = useState(OPEN_AI_SYSTEM_PROMPT);
	const [userPrompt, setUserPrompt] = useState(OPENAI_USER_PROMPT);
	const [specificationPrompt, setSpecificationPrompt] = useState(OPENAI_SPECIFICATION_PROMPT);
	const [UIScreensPrompt, setUIScreensPrompt] = useState(OPENAI_UISCREENS_PROMPT);
	const [max_tokens, setMaxTokens] = useState(4096);
	const [temperature, setTemperature] = useState(0);
	const [model, setModel] = useState("gpt-4o");
	const [canvasName, setCanvasName] = useState('Design Inspiration');
	const [selectedSidebar, setSelectedSidebar] = useState('settings');
	const [settings, setSettings] = useState({});
	const [provider, setProvider] = useState("openai");
	const [performanceSettings, setPerformanceSettings] = useState<PerformanceSettings>({
		useVirtualization: true,
		optimizedRendering: false,
		limitAnimations: false
	});

	// Memoize shape utils to avoid unnecessary re-renders
	const shapeUtils = useMemo(() => [PreviewShapeUtil], []);

	// Apply performance settings to PreviewShapes when they change
	useEffect(() => {
		if (editor) {
			// Get all preview shapes with the correct type
			const previewShapes = editor.store.allRecords().filter(
				record => record.typeName === 'shape' && record.type === 'preview'
			);
			
			// Update all shapes with the new rendering mode
			previewShapes.forEach(shape => {
				if (shape.typeName === 'shape') {
					editor.updateShape({
						id: shape.id,
						type: 'preview' as const,
						props: {
							renderingMode: performanceSettings.optimizedRendering ? 'optimized' : 'normal'
						}
					});
				}
			});
		}
	}, [editor, performanceSettings.optimizedRendering]);

	useEffect(() => {
		pb.authStore.loadFromCookie(document.cookie, "pb_auth");
		setUser(pb.authStore.model);
	}, []);	

	// Handle zooming in/out with improved performance
	const handleZoomIn = useCallback(() => {
		if (editor) {
			// Using standard zoom methods without arguments
			editor.zoomIn();
		}
	}, [editor]);

	const handleZoomOut = useCallback(() => {
		if (editor) {
			// Using standard zoom methods without arguments
			editor.zoomOut();
		}
	}, [editor]);

	const debug = useSearchParams().get('debug')
	
	return (
		<div className="flex flex-col h-screen bg-white">
			<header className="flex items-center justify-between p-4 bg-white border-b">
				<div className="flex space-x-4 items-center">
					<span className="font-bold  text-2xl mr-8 cursor-pointer" onClick={() => setSelectedSidebar("settings")}>UIDEC</span>
					<nav className="flex space-x-6 font-semibold">
						<a type="button" onClick={() => setSelectedSidebar("saved_canvas")} className={` cursor-pointer ${selectedSidebar === 'saved_canvas' ? 'underline text-gray-950' : 'text-gray-600 '}`}>
							Canvas Collections
						</a>
						<a type="button" onClick={() => setSelectedSidebar("favorites")} className={` cursor-pointer ${selectedSidebar === 'favorites' ? 'underline text-gray-950' : 'text-gray-600 '}`}>
							Favorites
						</a>
					</nav>
				</div>
				{selectedSidebar == "settings" && <CanvasName setCanvasName={setCanvasName} canvasName={canvasName }/> }
				<div className="flex space-x-4 items-center">
					{selectedSidebar == "settings" && (
						<>
							<SaveButton userId={user?.id} editor={editor} name={canvasName} settings={settings} />
							<CanvasSettings 
								performanceSettings={performanceSettings} 
								setPerformanceSettings={setPerformanceSettings} 
							/>
						</>
					)}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Avatar>
								<AvatarFallback>{user?.email?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
							</Avatar>
						</DropdownMenuTrigger>
						<DropdownMenuContent className="w-56" style={{
							zIndex: 1000
						}}>
							<DropdownMenuLabel>My Account</DropdownMenuLabel>
							<DropdownMenuLabel>
								<span className='text-xs'> {user?.email}</span> 
							</DropdownMenuLabel>
							<DropdownMenuItem onClick={
								async () => {
									await pb.authStore.clear();
									document.cookie = pb.authStore.exportToCookie({ httpOnly: false });
									window.location.href = '/signin';
								}
							}>
								Log out
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</header>
			<div className="flex flex-1 overflow-hidden">
				<Sidebar 
					systemPrompt={systemPrompt} 
					userPrompt={userPrompt} 
					specificationPrompt={specificationPrompt} 
					UIScreensPrompt={UIScreensPrompt} 
					setSpecificationPrompt={setSpecificationPrompt} 
					setUIScreensPrompt={setUIScreensPrompt}
					max_tokens={max_tokens} 
					temperature={temperature} 
					model={model} 
					provider={provider}
					setSystemPrompt={setSystemPrompt} 
					setUserPrompt={setUserPrompt} 
					setMaxTokens={setMaxTokens} 
					setTemperature={setTemperature} 
					setModel={setModel} 
					setProvider={setProvider} 
					savedEditor={savedEditor} 
					editor={editor} 
					setEditor={setEditor} 
					user_id={user?.id} 
					setSelectedSidebar={setSelectedSidebar} 
					selectedSidebar={selectedSidebar} 
					setSettings={setSettings} 
					settings={settings} 
					favoriteEditor={favoriteEditor} 
				/>
				<main className="flex-1 bg-gray-100 relative">
					<div>
						<div className={`h-screen ${selectedSidebar === 'settings' ? '' : 'hidden'} `} >
							<Tldraw 
								onMount={(editor) => setEditor(editor)}
								persistenceKey='design_inspo'
								shapeUtils={shapeUtils} 
								hideUi 
								components={{
									ContextMenu: CustomContextMenu,
								}}
								// Performance settings are handled at the shape level
							>
							</Tldraw>
						</div>
						<div className={`h-screen ${selectedSidebar === 'saved_canvas' ? '' : 'hidden'} `} >
							<Tldraw 
								onMount={(savedEditor) =>{
									savedEditor.updateInstanceState({})
									setSavedEditor(savedEditor);
								}}
								persistenceKey='saved_canvas'
								shapeUtils={shapeUtils} 
								hideUi 
								components={{
									ContextMenu: CustomContextMenu,
								}}
								// Performance settings are handled at the shape level
							>
							</Tldraw>
						</div>
						<div className={`h-screen ${selectedSidebar === 'favorites' ? '' : 'hidden'} `} >
							<Tldraw 
								onMount={(favoriteEditor) => {
									favoriteEditor.updateInstanceState({})
									setFavoriteEditor(favoriteEditor);
								}}
								persistenceKey='favorites_canvas'
								shapeUtils={shapeUtils} 
								hideUi 
								components={{
									ContextMenu: CustomContextMenu,
								}}
								// Performance settings are handled at the shape level
							>
							</Tldraw>
						</div>
					</div>

					{/* Zoom controls */}
					{editor && selectedSidebar === 'settings' && (
						<div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
							<Button variant="outline" size="icon" onClick={handleZoomIn} title="Zoom In">
								<ArrowUpSquare size={20} />
							</Button>
							<Button variant="outline" size="icon" onClick={handleZoomOut} title="Zoom Out">
								<ArrowDownSquare size={20} />
							</Button>
						</div>
					)}
				</main>
				
				<aside style={{ zIndex: 9999 }} >
					{debug == "true" && 
						<Config 
							systemPrompt={systemPrompt} 
							userPrompt={userPrompt} 
							specificationPrompt={specificationPrompt} 
							UIScreensPrompt={UIScreensPrompt}
							setSpecificationPrompt={setSpecificationPrompt} 
							setUIScreensPrompt={setUIScreensPrompt}
							max_tokens={max_tokens} 
							temperature={temperature} 
							model={model} 
							provider={provider}
							setSystemPrompt={setSystemPrompt} 
							setUserPrompt={setUserPrompt} 
							setMaxTokens={setMaxTokens} 
							setTemperature={setTemperature} 
							setModel={setModel} 
							setProvider={setProvider} 
						/>
					}
					{editor && selectedSidebar === 'settings' && <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 flex justify-center space-x-2">
						<Button variant={"outline"} onClick={() => { editor?.undo(); }}><UndoDot size={20} /></Button>
						<Button variant={"destructive"} onClick={() => {
							editor.selectAll()
							editor.deleteShapes(editor.getSelectedShapes())
						}}>Clear Canvas</Button>
						<Button variant={"outline"} onClick={() => { editor?.redo(); }}>< RedoDot size={20} /></Button>
					</div>
					}
				</aside>
			</div>
		</div>
	)
}
