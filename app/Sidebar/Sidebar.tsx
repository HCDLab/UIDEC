'use client'

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { businessDomain, designStyles, deviceTypes, UITypes } from './options'
import { Button } from "@/components/ui/button"
import ColorSelector from "./ColorSelector";
import { Editor } from 'tldraw'
import FontSelector from './FontSelector';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label";
import { MakeRealButton } from "../components/MakeRealButton";
import { useState } from 'react'
import { Lock, Unlock } from 'lucide-react';

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
}: {
    systemPrompt?: string,
    userPrompt?: string,
    max_tokens?: number,
    temperature?: number,
    model?: string,
    setSystemPrompt: (value: string) => void,
    setUserPrompt: (value: string) => void,
    setMaxTokens: (value: number) => void,
    setTemperature: (value: number) => void,
    setModel: (value: string) => void,
    editor: Editor | null,
    setEditor: (value: Editor | null) => void
}) {
    const [domain, setDomain] = useState("");
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

    const [lockedFields, setLockedFields] = useState<Set<string>>(new Set());

    const toggleLock = (field: string) => {
        setLockedFields((prevLockedFields) => {
            const newLockedFields = new Set(prevLockedFields);
            if (newLockedFields.has(field)) {
                newLockedFields.delete(field);
            } else {
                newLockedFields.add(field);
            }
            return newLockedFields;
        });
    };

    const generateDesignsConstraints = () => {
        let spec = ``;
        if (domain) {
            spec += `Domain: ${domain}\n`;
        }
        if (designSystem) {
            spec += `Design System: ${designSystem}\n`;
        }
        if (colors.length) {
            spec += `Colors: ${colors.map((color) => color.hex).join(", ")}\n`;
        }
        if (fonts.length) {
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

    return (
        <aside className="w-64 p-4 bg-gray-100 border-r">
            <div className="space-y-4 overflow-auto h-5/6">
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="domain">Domain:</Label>
                        <button onClick={() => toggleLock("domain")} className="text-gray-500">
                            {lockedFields.has("domain") ? <Lock className="h-5 w-5" /> : <Unlock className="h-5 w-5" />}
                        </button>
                    </div>
                    <Select onValueChange={(value) => setDomain(value)} value={domain} disabled={lockedFields.has("domain")}>
                        <SelectTrigger id="domain">
                            <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                            {businessDomain.map((item) => (
                                <SelectItem key={item} value={item}>{item}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="design-system">Design System:</Label>
                        <button onClick={() => toggleLock("designSystem")} className="text-gray-500">
                            {lockedFields.has("designSystem") ? <Lock className="h-5 w-5" /> : <Unlock className="h-5 w-5" />}
                        </button>
                    </div>
                    <Select onValueChange={(value) => setDesignSystem(value)} value={designSystem} disabled={lockedFields.has("designSystem")}>
                        <SelectTrigger id="design-system">
                            <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="material">Material</SelectItem>
                            <SelectItem value="bootstrap">Bootstrap</SelectItem>
                            <SelectItem value="tailwind">Tailwind</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="colors">Colors:</Label>
                        <button onClick={() => toggleLock("colors")} className="text-gray-500">
                            {lockedFields.has("colors") ? <Lock className="h-5 w-5" /> : <Unlock className="h-5 w-5" />}
                        </button>
                    </div>
                    <ColorSelector colors={colors} setColors={setColors} />
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="fonts">Fonts:</Label>
                        <button onClick={() => toggleLock("fonts")} className="text-gray-500">
                            {lockedFields.has("fonts") ? <Lock className="h-5 w-5" /> : <Unlock className="h-5 w-5" />}
                        </button>
                    </div>
                    <FontSelector fonts={fonts} setFonts={setFonts} />
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="device">Device:</Label>
                        <button onClick={() => toggleLock("device")} className="text-gray-500">
                            {lockedFields.has("device") ? <Lock className="h-5 w-5" /> : <Unlock className="h-5 w-5" />}
                        </button>
                    </div>
                    <Select onValueChange={(value) => setDevice(value)} value={device} disabled={lockedFields.has("device")}>
                        <SelectTrigger id="device">
                            <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                            {deviceTypes.map((item) => (
                                <SelectItem key={item} value={item}>{item}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="style">Style:</Label>
                        <button onClick={() => toggleLock("style")} className="text-gray-500">
                            {lockedFields.has("style") ? <Lock className="h-5 w-5" /> : <Unlock className="h-5 w-5" />}
                        </button>
                    </div>
                    <Select onValueChange={(value) => setStyle(value)} value={style} disabled={lockedFields.has("style")}>
                        <SelectTrigger id="style">
                            <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                            {designStyles.map((item) => (
                                <SelectItem key={item} value={item}>{item}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="functionality">Functionality:</Label>
                        <button onClick={() => toggleLock("functionality")} className="text-gray-500">
                            {lockedFields.has("functionality") ? <Lock className="h-5 w-5" /> : <Unlock className="h-5 w-5" />}
                        </button>
                    </div>
                    <Select onValueChange={(value) => setFunctionality(value)} value={functionality} disabled={lockedFields.has("functionality")}>
                        <SelectTrigger id="functionality">
                            <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                            {UITypes.map((item) => (
                                <SelectItem key={item} value={item}>{item}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="target-audience">Target Audience:</Label>
                        <button onClick={() => toggleLock("targetAudience")} className="text-gray-500">
                            {lockedFields.has("targetAudience") ? <Lock className="h-5 w-5" /> : <Unlock className="h-5 w-5" />}
                        </button>
                    </div>
                    <Input
                        id="target-audience"
                        placeholder="Enter target audience"
                        value={targetAudience}
                        onChange={(e) => setTargetAudience(e.target.value)}
                        disabled={lockedFields.has("targetAudience")}
                    />
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="product-purpose">Product Purpose:</Label>
                        <button onClick={() => toggleLock("productPurpose")} className="text-gray-500">
                            {lockedFields.has("productPurpose") ? <Lock className="h-5 w-5" /> : <Unlock className="h-5 w-5" />}
                        </button>
                    </div>
                    <Input
                        id="product-purpose"
                        placeholder="Enter product purpose"
                        value={productPurpose}
                        onChange={(e) => setProductPurpose(e.target.value)}
                        disabled={lockedFields.has("productPurpose")}
                    />
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="anything-else">Anything else in mind:</Label>
                        <button onClick={() => toggleLock("anythingElse")} className="text-gray-500">
                            {lockedFields.has("anythingElse") ? <Lock className="h-5 w-5" /> : <Unlock className="h-5 w-5" />}
                        </button>
                    </div>
                    <Input
                        id="anything-else"
                        placeholder="Enter additional info"
                        value={anythingElse}
                        onChange={(e) => setAnythingElse(e.target.value)}
                        disabled={lockedFields.has("anythingElse")}
                    />
                </div>
            </div>
            <div className="flex flex-col space-y-2 mt-4">
                <MakeRealButton
                    generateDesignsConstraints={generateDesignsConstraints}
                    editor={editor}
                    systemPrompt={systemPrompt}
                    userPrompt={userPrompt}
                    max_tokens={max_tokens}
                    temperature={temperature}
                    model={model}
                />
                <Button variant="outline" className="w-full">
                    Export Settings
                </Button>
            </div>
        </aside>
    );
}
