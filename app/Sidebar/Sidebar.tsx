'use client'

import { DeleteIcon, Lock, PlusIcon, Unlock } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { UITypes, businessDomain, designStyles, deviceTypes } from './options'
import { useEffect, useState } from 'react'

import { Button } from "@/components/ui/button"
import ColorSelector from "./ColorSelector";
import { Editor } from 'tldraw'
import FontSelector from './FontSelector';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label";
import { MakeRealButton } from "../components/MakeRealButton";
import pb from '@/client/pocketBase';

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
    setEditor,
    isOpen,
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
    setEditor: (value: Editor | null) => void,
    isOpen: boolean,
}) {
    const [domain, setDomain] = useState("");
    const [designSystem, setDesignSystem] = useState("");
    const [colors, setColors] = useState<Color[]>([{ hex: '' }]);
    const [fonts, setFonts] = useState<string[]>(['']);
    const [device, setDevice] = useState("");
    const [style, setStyle] = useState("");
    const [screen_type, setScreenType] = useState("");
    const [existingUI, setExistingUI] = useState("");
    const [targetAudience, setTargetAudience] = useState("");
    const [productPurpose, setProductPurpose] = useState("");
    const [designExamples, setDesignExamples] = useState("");
    const [otherRequirements, setOtherRequirements] = useState("");
    const [logoURL, setLogoURL] = useState("");
    const [dataSetScreens, setDataSetScreens] = useState<string[]>([]);

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
        if (screen_type) {
            spec += `Screen Type: ${screen_type}\n`;
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
        if (otherRequirements) {
            spec += `Other: ${otherRequirements}\n`;
        }
        if (logoURL) {
            spec += `Logo URL: ${logoURL}\n`;
        }
        
        return spec;
    }

    const fileURL = (uploadResponse: any) => {
        const base_url = process.env.NEXT_PUBLIC_POCKETBASE_URL;
        return `${base_url}api/files/${uploadResponse?.collectionName}/${uploadResponse?.id}/${uploadResponse?.image}`
    }
    const getFileID = (url: string) => {
        const parts = url.split('/');
        return parts[parts.length - 2];
    }

    const handleFileChange = async(e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const formData = new FormData();
            formData.append("image", file);
            try{
                const uploadLogoResponse = await pb.collection('logos').create(formData);
                setLogoURL(fileURL(uploadLogoResponse));
            } catch (error) {
                console.log(error);
            }
        }
    }

    const handleDeleteLogo = async() => {
        setLogoURL("");
        const uploadLogoResponse = await pb.collection('logos').delete(getFileID(logoURL));
    }
    
    useEffect(() => {
        const fetchScreenType = async () => {
            if (screen_type) {
                try {
                    const screenTypeResponse = await pb.collection('ui_screens').getFirstListItem(`category="${screen_type}"`);
                    if (screenTypeResponse) {
                        const imageURLs = screenTypeResponse?.field.map((image: any) => {
                            return `${process.env.NEXT_PUBLIC_POCKETBASE_URL}api/files/${screenTypeResponse.collectionName}/${screenTypeResponse.id}/${image}`
                        }
                        );
                        console.log(imageURLs);
                        setDataSetScreens(imageURLs);
                    }
                } catch (error) {
                    console.error("Failed to fetch screen type", error);
                }
            }
        };

        fetchScreenType();
    }, [screen_type]);
            
    if (!isOpen) {
        return null;
    }

    return (
        <aside className="w-80 p-2 bg-gray-100 border-r">
            <div className="space-y-4 overflow-auto h-5/6 p-2">
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

                <div className="border-t border-gray-300 my-8" />

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
                        <Label htmlFor="screen_type">Screen Type:</Label>
                        <button onClick={() => toggleLock("screen_type")} className="text-gray-500">
                            {lockedFields.has("screen_type") ? <Lock className="h-5 w-5" /> : <Unlock className="h-5 w-5" />}
                        </button>
                    </div>
                    <Select onValueChange={(value) => setScreenType(value)} value={screen_type} disabled={lockedFields.has("screen_type")}>
                        <SelectTrigger id="screen_type">
                            <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                            {UITypes.map((item) => (
                                <SelectItem key={item} value={item}>{item}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="border-t border-gray-300 my-8" />
                        
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="colors">Colors:</Label>
                        <button onClick={() => toggleLock("colors")} className="text-gray-500">
                            {lockedFields.has("colors") ? <Lock className="h-5 w-5" /> : <Unlock className="h-5 w-5" />}
                        </button>
                    </div>
                    {lockedFields.has("colors") ? (
                        <ColorSelector colors={colors} setColors={setColors} disabled />
                    ) : (
                        <ColorSelector colors={colors} setColors={setColors} />
                    )}
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="fonts">Fonts:</Label>
                        <button onClick={() => toggleLock("fonts")} className="text-gray-500">
                            {lockedFields.has("fonts") ? <Lock className="h-5 w-5" /> : <Unlock className="h-5 w-5" />}
                        </button>
                    </div>
                    {lockedFields.has("fonts") ? (
                        <FontSelector fonts={fonts} setFonts={setFonts} disabled />
                    ) : (
                        <FontSelector fonts={fonts} setFonts={setFonts} />
                    )}
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
                        <Label className="text-sm font-medium">Logo:</Label>
                    </div>
                    {logoURL ? (
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center relative">
                            <img src={logoURL} alt = "logo" className="w-16 h-16" />
                            <DeleteIcon className="absolute top-0 right-0 h-4 w-4 cursor-pointer" onClick={handleDeleteLogo} />
                        </div>
                    ) : (
                    <Button variant="outline" className="w-full" onClick={() => document.getElementById('logo-upload')?.click()}>
                        Upload your logo
                        <input type="file" accept="image/*" onChange={handleFileChange} id="logo-upload" className="hidden" />
                        <PlusIcon className="ml-2 h-4 w-4" />
                    </Button>
                    )}
                </div>

                <div className="border-t border-gray-300 my-8" />

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="anything-else">Other Requirements:</Label>
                        <button onClick={() => toggleLock("otherRequirements")} className="text-gray-500">
                            {lockedFields.has("otherRequirements") ? <Lock className="h-5 w-5" /> : <Unlock className="h-5 w-5" />}
                        </button>
                    </div>
                    <Input
                        id="anything-else"
                        placeholder="Enter additional info"
                        value={otherRequirements}
                        onChange={(e) => setOtherRequirements(e.target.value)}
                        disabled={lockedFields.has("otherRequirements")}
                    />
                </div>
                <div className="border-t border-gray-300 my-8" />

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
                    UIScreens={dataSetScreens}
                />
                <Button variant="outline" className="w-full">
                    Export Settings
                </Button>
            </div>
        </aside>
    );
}
