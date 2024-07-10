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
import { Editor, Tldraw } from 'tldraw'
import { OPENAI_USER_PROMPT, OPEN_AI_SYSTEM_PROMPT } from '../prompt';

import Config from '../components/Config';
import { PreviewShapeUtil } from '../PreviewShape/PreviewShape'
import Sidebar from '../Sidebar/Sidebar';
import pb from '@/client/pocketBase';
import { useState } from 'react';

const logout = async(pb: any)=> {
	try {
		pb.authStore.clear();
		document.cookie = pb.authStore.exportToCookie({ httpOnly: false });

	} catch (error) {
		throw error;
	}
}

const  getUser = async(pb: any) =>{
	try {
		pb.authStore.loadFromCookie(document?.cookie ?? "");
		return pb.authStore.model;
	} catch (error) {
		throw error;
	}
}

 

const shapeUtils = [PreviewShapeUtil]
export default function Home() {
	const [editor, setEditor] = useState<Editor | null>(null)
	const [systemPrompt, setSystemPrompt] = useState(OPEN_AI_SYSTEM_PROMPT);
	const [userPrompt, setUserPrompt] = useState(OPENAI_USER_PROMPT);
	const [max_tokens, setMaxTokens] = useState(4096);
	const [temperature, setTemperature] = useState(0);
	const [model, setModel] = useState("gpt-4o");
	const user = pb.authStore.model	


	return (
		<div className="flex flex-col h-screen bg-white">
			<header className="flex items-center justify-between p-4 bg-white border-b">
				<div className="flex space-x-4">
					<span className="font-bold">Inspiration.</span>
					<nav className="flex space-x-4">
						<a href="#" className="text-gray-600">
							Canvas Collections
						</a>
						<a href="#" className="text-gray-600">
							Favorites
						</a>
					</nav>
				</div>
				<span className="text-gray-600">Design Inspiration</span>
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
			</header>
			<div className="flex flex-1 overflow-hidden">
				<Sidebar systemPrompt={systemPrompt} userPrompt={userPrompt} max_tokens={max_tokens} temperature={temperature} model={model} setSystemPrompt={setSystemPrompt} setUserPrompt={setUserPrompt} setMaxTokens={setMaxTokens} setTemperature={setTemperature} setModel={setModel}
				editor={editor} setEditor={setEditor}/>
				<main className="flex-1 bg-gray-100">
					<div>
						<div className="h-screen">
							<Tldraw onMount={(editor) => setEditor(editor)} 
							persistenceKey='design_inspo'
							shapeUtils={shapeUtils} hideUi />
						</div>
					</div>
				</main>
				<aside style={{zIndex: 1000}} >
					<Config systemPrompt={systemPrompt} userPrompt={userPrompt} max_tokens={max_tokens} temperature={temperature} model={model} setSystemPrompt={setSystemPrompt} setUserPrompt={setUserPrompt} setMaxTokens={setMaxTokens} setTemperature={setTemperature} setModel={setModel} />
				</aside>
			</div>
		</div>
	)
}
