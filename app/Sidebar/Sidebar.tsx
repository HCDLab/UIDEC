'use client'

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { businessDomain, designStyles, deviceTypes } from './options'

import { Button } from "@/components/ui/button"
import ColorSelector from "./ColorSelector";
import { Editor } from 'tldraw'
import FontSelector from './FontSelector';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label";
import { MakeRealButton } from "../components/MakeRealButton";
import { useState } from 'react'

interface Color {
    hex: string;
}
export default function Sidebar({
    systemPrompt,
    userPrompt,
    max_tokens,
    temperature,
    model,
    setSystemPrompt,
    setUserPrompt,
    setMaxTokens,
    setTemperature,
    setModel,
    editor,
    setEditor
}:
{
    systemPrompt?: string,
    userPrompt?: string,
    max_tokens?: number,
    temperature?: number
    model?: string
    setSystemPrompt: (value: string) => void
    setUserPrompt: (value: string) => void
    setMaxTokens: (value: number) => void
    setTemperature: (value: number) => void
    setModel: (value: string) => void
    editor: Editor | null
    setEditor: (value: Editor | null) => void
}) {
    const [domain, setIndustry] = useState("");
    const [designSystem, setDesignSystem] = useState("");
    const [colors, setColors] = useState<Color[]>([{ hex: '' }]);
    const [fonts, setFonts] = useState<string[]>(['']);
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
        if (domain) {
            spec += `Domain: ${domain}\n`;
        }
        if (designSystem) {
            spec += `Design System: ${designSystem}\n`;
        }
        if (colors) {
            spec += `Colors: ${colors.map((color) => color.hex).join(", ")}\n`;
        }
        if (fonts) {
            spec += `Fonts: ${fonts.join(", ")}\n`;
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
     return(
         <aside className="w-64 p-4 bg-gray-100 border-r">
             <div className="space-y-4 overflow-auto h-5/6">
                 <div className="space-y-2">
                     <Label htmlFor="domain">Domain:</Label>
                     <Select onValueChange={(value) => setIndustry(value)} value={domain}>
                         <SelectTrigger id="domain">
                             <SelectValue
                                 placeholder="Select"
                             />
                         </SelectTrigger>
                         <SelectContent>
                             {businessDomain.map((item) => (
                                 <SelectItem key={item} value={item}>{item}</SelectItem>
                                ))}     
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
                     <ColorSelector colors={colors} setColors={setColors} />
                 </div>
                 <div className="space-y-2">
                     <Label htmlFor="fonts">Fonts:</Label>
                     <FontSelector fonts={fonts} setFonts={setFonts} />
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
                             {deviceTypes.map((item) => (
                                    <SelectItem key={item} value={item}>{item}</SelectItem>
                                ))}
                         </SelectContent>
                     </Select>
                 </div>
                 <div className="space-y-2">
                     <Label htmlFor="style">Style:</Label>
                      <Select onValueChange={(value) => setStyle(value)} value={style}>
                            <SelectTrigger id="style">
                                <SelectValue
                                    placeholder="Select"
                                />
                            </SelectTrigger>
                            <SelectContent>
                                {designStyles.map((item) => (
                                        <SelectItem key={item} value={item}>{item}</SelectItem>
                                    ))}
                            </SelectContent>
                        </Select>
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
                     <Label htmlFor="product-purpose">Product Purpose:</Label>
                     <Input
                         id="product-purpose"
                         placeholder="Enter product purpose"
                         value={productPurpose}
                         onChange={(e) => setProductPurpose(e.target.value)}
                     />
                 </div>
                 <div className="space-y-2">
                     <Label htmlFor="design-examples">Example Product</Label>
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
                 <MakeRealButton generateDesignsConstraints={generateDesignsConstraints} editor={editor} systemPrompt={systemPrompt} userPrompt={userPrompt} max_tokens={max_tokens} temperature={temperature} model={model} />
                 <Button variant="outline" className="w-full">
                     Export Settings
                 </Button>
             </div>

         </aside>
     )
}