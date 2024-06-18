'use client';

import 'tldraw/tldraw.css'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Editor, Tldraw } from 'tldraw'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@/components/ui/select";
import { createContext, useState } from 'react'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label";
import { MakeRealButton } from './components/MakeRealButton';
import { PreviewShapeUtil } from './PreviewShape/PreviewShape'

const shapeUtils = [PreviewShapeUtil]

const editorContext = createContext({} as { editor: Editor })

export default function Home() {
	const [editor, setEditor] = useState<Editor | null>(null)
	const [industry, setIndustry] = useState("health");
	const [designSystem, setDesignSystem] = useState("");
	const [colors, setColors] = useState("");
	const [fonts, setFonts] = useState("");
	const [device, setDevice] = useState("");
	const [style, setStyle] = useState("");
	const [functionality, setFunctionality] = useState("");
	const [existingUI, setExistingUI] = useState("");
	const [targetAudience, setTargetAudience] = useState("");
	const [productPurpose, setProductPurpose] = useState("");
	const [designExamples, setDesignExamples] = useState("");
	const [anythingElse, setAnythingElse] = useState("");

	const generateDesignsConstraints = () => {
		let spec = ``;
		if (industry) {
			spec += `Industry: ${industry}\n`;
		}
		if (designSystem) {
			spec += `Design System: ${designSystem}\n`;
		}
		if (colors) {
			spec += `Colors: ${colors}\n`;
		}
		if (fonts) {
			spec += `Fonts: ${fonts}\n`;
		}
		if (device) {
			spec += `Device: ${device}\n`;
		}
		if (style) {
			spec += `Style: ${style}\n`;
		}
		if (functionality) {
			spec += `Functionality: ${functionality}\n`;
		}
		if (existingUI) {
			spec += `Existing UI: ${existingUI}\n`;
		}
		if (targetAudience) {
			spec += `Target Audience: ${targetAudience}\n`;
		}
		if (productPurpose) {
			spec += `Product Purpose: ${productPurpose}\n`;
		}
		if (designExamples) {
			spec += `Design Examples: ${designExamples}\n`;
		}
		if (anythingElse) {
			spec += `Other: ${anythingElse}\n`;
		}

		return spec;
	}

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
				<aside className="w-64 p-4 bg-gray-100 border-r">
					<div className="space-y-4 overflow-auto h-5/6">
						<div className="space-y-2">
							<Label htmlFor="industry">Industry:</Label>
							<Select onValueChange={(value) => setIndustry(value)} value={industry}>
								<SelectTrigger id="industry">
									<SelectValue
										placeholder="Select"
									/>
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="tech">Tech</SelectItem>
									<SelectItem value="health">Health</SelectItem>
									<SelectItem value="finance">Finance</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="space-y-2">
							<Label htmlFor="design-system">Design System:</Label>
							<Select onValueChange={(value) => setDesignSystem(value)} value={designSystem}>
								<SelectTrigger id="design-system">
									<SelectValue
										placeholder="Select"
									/>
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="material">Material</SelectItem>
									<SelectItem value="bootstrap">Bootstrap</SelectItem>
									<SelectItem value="tailwind">Tailwind</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="space-y-2">
							<Label htmlFor="colors">Colors:</Label>
							<Input
								id="colors"
								placeholder="Select colors"
								value={colors}
								onChange={(e) => setColors(e.target.value)}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="fonts">Fonts:</Label>
							<Input
								id="fonts"
								placeholder="Select fonts"
								value={fonts}
								onChange={(e) => setFonts(e.target.value)}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="device">Device:</Label>
							<Select onValueChange={(value) => setDevice(value)} value={device}>
								<SelectTrigger id="device">
									<SelectValue
										placeholder="Select"
									/>
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="mobile">Mobile</SelectItem>
									<SelectItem value="tablet">Tablet</SelectItem>
									<SelectItem value="desktop">Desktop</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="space-y-2">
							<Label htmlFor="style">Style:</Label>
							<Input
								id="style"
								placeholder="Enter style"
								value={style}
								onChange={(e) => setStyle(e.target.value)}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="functionality">Functionality:</Label>
							<Input
								id="functionality"
								placeholder="Enter functionality"
								value={functionality}
								onChange={(e) => setFunctionality(e.target.value)}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="existing-ui">Existing UI:</Label>
							<Input
								id="existing-ui"
								placeholder="Paste link or upload files"
								value={existingUI}
								onChange={(e) => setExistingUI(e.target.value)}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="target-audience">Target Audience:</Label>
							<Input
								id="target-audience"
								placeholder="Enter target audience"
								value={targetAudience}
								onChange={(e) => setTargetAudience(e.target.value)}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="product-purpose">Whats the Product Purpose:</Label>
							<Input
								id="product-purpose"
								placeholder="Enter product purpose"
								value={productPurpose}
								onChange={(e) => setProductPurpose(e.target.value)}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="design-examples">Any design examples in mind:</Label>
							<Input
								id="design-examples"
								placeholder="Enter design examples"
								value={designExamples}
								onChange={(e) => setDesignExamples(e.target.value)}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="anything-else">Anything else in mind:</Label>
							<Input
								id="anything-else"
								placeholder="Enter additional info"
								value={anythingElse}
								onChange={(e) => setAnythingElse(e.target.value)}
							/>
						</div>
					</div>
					<div className="flex flex-col space-y-2 mt-4">
						<MakeRealButton generateDesignsConstraints={generateDesignsConstraints} editor={editor} />
						<Button variant="outline" className="w-full">
							Export Settings
						</Button>
					</div>
				</aside>
				<main className="flex-1 bg-gray-100">
					<div>
						{/* {editor && (
                            <editorContext.Provider value={{ editor }}>
                                <ExternalToolbar />
                            </editorContext.Provider>
                        )} */}
						<div className="h-screen">
							<Tldraw onMount={(editor) => setEditor(editor)} 
							persistenceKey='design_inspo'
							shapeUtils={shapeUtils} hideUi />
						</div>
					</div>
				</main>
			</div>
		</div>
	)
}
