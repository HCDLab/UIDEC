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

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const formData = new FormData();
            formData.append("image", file);
            try {
                const uploadLogoResponse = await pb.collection('logos').create(formData);
                setLogoURL(fileURL(uploadLogoResponse));
            } catch (error) {
                console.log(error);
            }
        }
    }

    const handleDeleteLogo = async () => {
        setLogoURL("");
        const uploadLogoResponse = await pb.collection('logos').delete(getFileID(logoURL));
    }
<<<<<<< HEAD

    const exportSettings = () => {
        const settings = {
            domain: { value: domain, status: lockedFields.has("domain") ? "locked" : "open" },
            designSystem: { value: designSystem, status: lockedFields.has("designSystem") ? "locked" : "open" },
            colors: colors.map(color => ({ value: color.hex, status: lockedFields.has("colors") ? "locked" : "open" })),
            fonts: fonts.map(font => ({ value: font, status: lockedFields.has("fonts") ? "locked" : "open" })),
            device: { value: device, status: lockedFields.has("device") ? "locked" : "open" },
            style: { value: style, status: lockedFields.has("style") ? "locked" : "open" },
            screen_type: { value: screen_type, status: lockedFields.has("screen_type") ? "locked" : "open" },
            existingUI: { value: existingUI, status: lockedFields.has("existingUI") ? "locked" : "open" },
            targetAudience: { value: targetAudience, status: lockedFields.has("targetAudience") ? "locked" : "open" },
            productPurpose: { value: productPurpose, status: lockedFields.has("productPurpose") ? "locked" : "open" },
            designExamples: { value: designExamples, status: lockedFields.has("designExamples") ? "locked" : "open" },
            otherRequirements: { value: otherRequirements, status: lockedFields.has("otherRequirements") ? "locked" : "open" },
            logoURL: { value: logoURL, status: lockedFields.has("logo") ? "locked" : "open" }
        };
        const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'settings.json';
        a.click();
        URL.revokeObjectURL(url);
    };

    const importSettings = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target?.result) {
                    const settings = JSON.parse(event.target.result as string);

                    // Update states with values from settings
                    setDomain(settings.domain?.value || "");
                    setDesignSystem(settings.designSystem?.value || "");
                    setColors(settings.colors?.map((color: any) => ({ hex: color.value })) || [{ hex: '' }]);
                    setFonts(settings.fonts?.map((font: any) => font.value) || ['']);
                    setDevice(settings.device?.value || "");
                    setStyle(settings.style?.value || "");
                    setScreenType(settings.screen_type?.value || "");
                    setExistingUI(settings.existingUI?.value || "");
                    setTargetAudience(settings.targetAudience?.value || "");
                    setProductPurpose(settings.productPurpose?.value || "");
                    setDesignExamples(settings.designExamples?.value || "");
                    setOtherRequirements(settings.otherRequirements?.value || "");
                    setLogoURL(settings.logoURL?.value || "");

                    // Update lock statuses
                    setLockedFields(new Set([
                        ...(settings.domain?.status === "locked" ? ["domain"] : []),
                        ...(settings.designSystem?.status === "locked" ? ["designSystem"] : []),
                        ...(settings.colors?.some((color: any) => color.status === "locked") ? ["colors"] : []),
                        ...(settings.fonts?.some((font: any) => font.status === "locked") ? ["fonts"] : []),
                        ...(settings.device?.status === "locked" ? ["device"] : []),
                        ...(settings.style?.status === "locked" ? ["style"] : []),
                        ...(settings.screen_type?.status === "locked" ? ["screen_type"] : []),
                        ...(settings.existingUI?.status === "locked" ? ["existingUI"] : []),
                        ...(settings.targetAudience?.status === "locked" ? ["targetAudience"] : []),
                        ...(settings.productPurpose?.status === "locked" ? ["productPurpose"] : []),
                        ...(settings.designExamples?.status === "locked" ? ["designExamples"] : []),
                        ...(settings.otherRequirements?.status === "locked" ? ["otherRequirements"] : []),
                        ...(settings.logoURL?.status === "locked" ? ["logo"] : []),
                    ]));
                }
            };
            reader.readAsText(file);
        }
    };
=======
    
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
>>>>>>> 0afff3dc4a09ba6ba4db2cdc6c24dfe15f425617

    return (
        <aside className="w-80 p-2 bg-gray-100 border-r">
            <div className="space-y-4 overflow-auto p-2" style={{ height: '75%' }}>
                <div className="space-y-2">
                    {/* Domain */}
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

                    {/* Design System */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="design-system">Design System:</Label>
                            <button onClick={() => toggleLock("designSystem")} className="text-gray-500">
                                {lockedFields.has("designSystem") ? <Lock className="h-5 w-5" /> : <Unlock className="h-5 w-5" />}
                            </button>
                        </div>
                        <Input
                            id="design-system"
                            placeholder="Enter design system"
                            value={designSystem}
                            onChange={(e) => setDesignSystem(e.target.value)}
                            disabled={lockedFields.has("designSystem")}
                        />
                    </div>

                    {/* Colors */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label>Colors:</Label>
                            <button onClick={() => toggleLock("colors")} className="text-gray-500">
                                {lockedFields.has("colors") ? <Lock className="h-5 w-5" /> : <Unlock className="h-5 w-5" />}
                            </button>
                        </div>
                        <ColorSelector colors={colors} setColors={setColors} disabled={lockedFields.has("colors")} />
                    </div>

                    {/* Fonts */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label>Fonts:</Label>
                            <button onClick={() => toggleLock("fonts")} className="text-gray-500">
                                {lockedFields.has("fonts") ? <Lock className="h-5 w-5" /> : <Unlock className="h-5 w-5" />}
                            </button>
                        </div>
                        <FontSelector fonts={fonts} setFonts={setFonts} disabled={lockedFields.has("fonts")} />
                    </div>

                    {/* Device */}
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

                    {/* Style */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="style">Style:</Label>
                            <button onClick={() => toggleLock("style")} className="text-gray-500">
                                {lockedFields.has("style") ? <Lock className="h-5 w-5" /> : <Unlock className="h-5 w-5" />}
                            </button>
                        </div>
                        <Input
                            id="style"
                            placeholder="Enter style"
                            value={style}
                            onChange={(e) => setStyle(e.target.value)}
                            disabled={lockedFields.has("style")}
                        />
                    </div>

                    {/* Screen Type */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="screen-type">Screen Type:</Label>
                            <button onClick={() => toggleLock("screen_type")} className="text-gray-500">
                                {lockedFields.has("screen_type") ? <Lock className="h-5 w-5" /> : <Unlock className="h-5 w-5" />}
                            </button>
                        </div>
                        <Select onValueChange={(value) => setScreenType(value)} value={screen_type} disabled={lockedFields.has("screen_type")}>
                            <SelectTrigger id="screen-type">
                                <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                                {UITypes.map((item) => (
                                    <SelectItem key={item} value={item}>{item}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Existing UI */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="existing-ui">Existing UI:</Label>
                            <button onClick={() => toggleLock("existingUI")} className="text-gray-500">
                                {lockedFields.has("existingUI") ? <Lock className="h-5 w-5" /> : <Unlock className="h-5 w-5" />}
                            </button>
                        </div>
                        <Input
                            id="existing-ui"
                            placeholder="Enter existing UI"
                            value={existingUI}
                            onChange={(e) => setExistingUI(e.target.value)}
                            disabled={lockedFields.has("existingUI")}
                        />
                    </div>

                    {/* Target Audience */}
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

                    {/* Product Purpose */}
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

                    {/* Design Examples */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="design-examples">Design Examples:</Label>
                            <button onClick={() => toggleLock("designExamples")} className="text-gray-500">
                                {lockedFields.has("designExamples") ? <Lock className="h-5 w-5" /> : <Unlock className="h-5 w-5" />}
                            </button>
                        </div>
                        <Input
                            id="design-examples"
                            placeholder="Enter design examples"
                            value={designExamples}
                            onChange={(e) => setDesignExamples(e.target.value)}
                            disabled={lockedFields.has("designExamples")}
                        />
                    </div>

                    {/* Logo Upload */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label className="text-sm font-medium">Logo:</Label>
                            <button onClick={() => toggleLock("logo")} className="text-gray-500">
                                {lockedFields.has("logo") ? <Lock className="h-5 w-5" /> : <Unlock className="h-5 w-5" />}
                            </button>
                        </div>
                        {logoURL ? (
                            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center relative">
                                <img src={logoURL} alt="logo" className="w-16 h-16" />
                                <DeleteIcon className="absolute top-0 right-0 h-4 w-4 cursor-pointer" onClick={handleDeleteLogo} />
                            </div>
                        ) : (
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => document.getElementById('logo-upload')?.click()}
                                disabled={lockedFields.has("logo")}
                            >
                                Upload your logo
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    id="logo-upload"
                                    className="hidden"
                                    disabled={lockedFields.has("logo")}
                                />
                                <PlusIcon className="ml-2 h-4 w-4" />
                            </Button>
                        )}
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="other-requirements">Other Requirements:</Label>
                            <button onClick={() => toggleLock("otherRequirements")} className="text-gray-500">
                                {lockedFields.has("otherRequirements") ? <Lock className="h-5 w-5" /> : <Unlock className="h-5 w-5" />}
                            </button>
                        </div>
                        <Input
                            id="other-requirements"
                            placeholder="Enter other requirements"
                            value={otherRequirements}
                            onChange={(e) => setOtherRequirements(e.target.value)}
                            disabled={lockedFields.has("otherRequirements")}
                        />
                    </div>

                    {/* Import and Export Settings */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="import-settings">Import Settings:</Label>
                        </div>
                        <input
                            id="import-settings"
                            type="file"
                            accept=".json"
                            onChange={importSettings}
                            className="block w-full text-sm text-gray-500 border border-gray-300 rounded"
                        />
                    </div>
                </div>
            </div>
<<<<<<< HEAD
            <div className="p-4 border-t border-gray-300 mt-4 space-y-2">
                <Button
                    onClick={() => {
                        console.log('Add a new design functionality to be implemented');
                    }}
                    className="w-full bg-black text-white hover:bg-gray-800"
                >
                    Add a New Design
                </Button>
                <Button
                    onClick={exportSettings}
                    className="w-full bg-black text-white hover:bg-gray-800"
                >
=======
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
>>>>>>> 0afff3dc4a09ba6ba4db2cdc6c24dfe15f425617
                    Export Settings
                </Button>
                
            </div>

        </aside>
    );
}
