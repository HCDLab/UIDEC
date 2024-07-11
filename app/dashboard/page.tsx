'use client';

import 'tldraw/tldraw.css'

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Editor, Tldraw, getSnapshot } from 'tldraw'
import { OPENAI_USER_PROMPT, OPEN_AI_SYSTEM_PROMPT } from '../prompt';
import {
	QueryClient,
	QueryClientProvider,
	useQueryClient,
} from '@tanstack/react-query'

import { Button } from '@/components/ui/button';
import Config from '../components/Config';
import { Input } from '@/components/ui/input';
import { PreviewShapeUtil } from '../PreviewShape/PreviewShape'
import Sidebar from '../Sidebar/Sidebar';
import pb from '@/client/pocketBase';
import { toast } from 'sonner';
import { useState } from 'react';

const SaveButton = ({ name,userId, editor,settings }: {
	name: string,
	userId: string,
	editor: Editor | null,
	settings: any
}) => {
	
   const queryClient = useQueryClient()

	if (!editor) return


	const saveCanvas = async () => {
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
		toast('Canvas saved', {
			duration: 3000,
		})
		queryClient.invalidateQueries({ queryKey: ['saved_canvas'] })
	};

	return (
		<Button onClick={saveCanvas} className="">
			Save Canvas
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
				<span className="text-gray-600 font-semibold">{text}</span>
			)}
			<span className="text-gray-400 text-xs">Click to edit canvas name</span>
		</div>
	);
};
const shapeUtils = [PreviewShapeUtil]
const queryClient = new QueryClient()


export default function Dashboard() {
	const [editor, setEditor] = useState<Editor | null>(null)
	const [savedEditor, setSavedEditor] = useState<Editor | null>(null)
	const [systemPrompt, setSystemPrompt] = useState(OPEN_AI_SYSTEM_PROMPT);
	const [userPrompt, setUserPrompt] = useState(OPENAI_USER_PROMPT);
	const [max_tokens, setMaxTokens] = useState(4096);
	const [temperature, setTemperature] = useState(0);
	const [model, setModel] = useState("gpt-4o");
	const user = pb.authStore.model
	const [canvasName, setCanvasName] = useState('Design Inspiration');
	const [selectedSidebar, setSelectedSidebar] = useState('settings');
	const [settings, setSettings] = useState({});


	return (
		<QueryClientProvider client={queryClient}>
			<div className="flex flex-col h-screen bg-white">
				<header className="flex items-center justify-between p-4 bg-white border-b">
					<div className="flex space-x-4 items-center">
						<span className="font-bold  text-2xl mr-8 cursor-pointer" onClick={() => setSelectedSidebar("settings")}>Inspiration.</span>
						<nav className="flex space-x-6 font-semibold">
							<a type="button" onClick={() => setSelectedSidebar("saved_canvas")} className={` cursor-pointer ${selectedSidebar === 'saved_canvas' ? 'underline text-gray-950' : 'text-gray-600 '}`}>
								Canvas Collections
							</a>
							<a type="button" onClick={() => setSelectedSidebar("favorite")} className={` cursor-pointer ${selectedSidebar === 'favorite' ? 'underline text-gray-950' : 'text-gray-600 '}`}>
								Favorites
							</a>
						</nav>
					</div>
					{selectedSidebar == "settings" && <CanvasName setCanvasName={setCanvasName} canvasName={canvasName }/> }
					<div className="flex space-x-12">
						{selectedSidebar == "settings" &&<SaveButton userId={user?.id} editor={editor} name={canvasName} settings={settings} />}
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Avatar>
									<AvatarFallback>{user?.email[0].toUpperCase()}</AvatarFallback>
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

				<Sidebar systemPrompt={systemPrompt} userPrompt={userPrompt} max_tokens={max_tokens} temperature={temperature} model={model} setSystemPrompt={setSystemPrompt} setUserPrompt={setUserPrompt} setMaxTokens={setMaxTokens} setTemperature={setTemperature} setModel={setModel} savedEditor={savedEditor}
						editor={editor} setEditor={setEditor} user_id={user?.id} setSelectedSidebar={setSelectedSidebar}  selectedSidebar={selectedSidebar} setSettings={setSettings} settings={settings} />
					<main className="flex-1 bg-gray-100">
						<div>
							<div className={`h-screen ${selectedSidebar === 'settings' ? '' : 'hidden'} `} >
								<Tldraw onMount={(editor) => setEditor(editor)}
									persistenceKey='design_inspo'
									shapeUtils={shapeUtils} hideUi >
								</Tldraw>
							</div>
							<div className={`h-screen ${selectedSidebar === 'saved_canvas' ? '' : 'hidden'} `} >
								<Tldraw onMount={(savedEditor) =>{
											savedEditor.updateInstanceState({
												isReadonly: true
											})
											setSavedEditor(savedEditor);
										}
									}
									persistenceKey='saved_canvas'
									shapeUtils={shapeUtils} hideUi >
								</Tldraw>
							</div>
						</div>
					</main>
					<aside style={{ zIndex: 9999 }} >
						<Config systemPrompt={systemPrompt} userPrompt={userPrompt} max_tokens={max_tokens} temperature={temperature} model={model} setSystemPrompt={setSystemPrompt} setUserPrompt={setUserPrompt} setMaxTokens={setMaxTokens} setTemperature={setTemperature} setModel={setModel} />
					</aside>
				</div>
			</div>
		</QueryClientProvider>
	)
}
