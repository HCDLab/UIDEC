'use client';

import 'tldraw/tldraw.css'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Editor, Tldraw } from 'tldraw'
import { OPENAI_USER_PROMPT, OPEN_AI_SYSTEM_PROMPT } from '../prompt';

import Config from '../components/Config';
import { PreviewShapeUtil } from '../PreviewShape/PreviewShape'
import Sidebar from '../Sidebar/Sidebar';
import { useState } from 'react';

const shapeUtils = [PreviewShapeUtil]
export default function Home() {
	const [editor, setEditor] = useState<Editor | null>(null)
	const [systemPrompt, setSystemPrompt] = useState(OPEN_AI_SYSTEM_PROMPT);
	const [userPrompt, setUserPrompt] = useState(OPENAI_USER_PROMPT);
	const [max_tokens, setMaxTokens] = useState(4096);
	const [temperature, setTemperature] = useState(0);
	const [model, setModel] = useState("gpt-4o");

	return (
		<div className="flex flex-col h-screen bg-white">
			<header className="flex items-center justify-between p-4 bg-white border-b">
				<div className="flex space-x-4">
					<span className="font-bold">Inspiration.</span>
					<nav className="flex space-x-4">
						<a href="#" className="text-gray-600">
							Recent
						</a>
						<a href="#" className="text-gray-600">
							Favourites
						</a>
					</nav>
				</div>
				<span className="text-gray-600">Design Inspiration 1</span>
				<Avatar>
					<AvatarImage src="/placeholder-user.jpg" />
					<AvatarFallback>U</AvatarFallback>
				</Avatar>
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
