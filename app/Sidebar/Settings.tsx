'use client';
interface Color {
    hex: string;
}

import { DeleteIcon, PlusIcon } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { designStyles, deviceTypes } from './options';

import { Button } from "@/components/ui/button"
import CloseLock from '../icons/CloseLock';
import ColorSelector from "./ColorSelector";
import { Editor } from '@tldraw/tldraw';
import FontSelector from './FontSelector';
import { HelpCircle } from 'lucide-react';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label";
import { MakeRealButton } from "../components/MakeRealButton";
import OpenLock from '../icons/OpenLock';
import { Textarea } from '@/components/ui/textarea';
import ThemeSelector from '../components/ThemeSelector';
import { exportSettings } from '@/utils/utils';
import pb from '@/client/pocketBase';
import { useQuery } from '@tanstack/react-query';

const fetchindustries = async () => {
    const industries = await pb.collection('industries').getFullList({
        sort: 'name',
    });
    if (!industries) return [];
    return industries;
}

const fetchScreenTypes = async () => {
    const screenTypes = await pb.collection('screen_types').getFullList({
        sort: 'name',
    });
    if (!screenTypes) return [];
    return screenTypes;
}


export default function Settings(
    {
        generateDesignsConstraints,
        editor,
        systemPrompt,
        userPrompt,
        specificationPrompt,
        UIScreensPrompt,
        max_tokens,
        temperature,
        model,
        dataSetScreens,
        industry,
        setIndustry,
        productPurpose,
        setProductPurpose,
        targetAudience,
        setTargetAudience,
        device,
        setDevice,
        screen_type,
        setScreenType,
        colors,
        setColors,
        fonts,
        setFonts,
        style,
        setStyle,
        otherRequirements,
        setOtherRequirements,
        logoURL,
        lockedFields,
        toggleLock,
        handleFileChange,
        handleDeleteLogo,
        importSettings,
        selectedSidebar,
        settings,
        designTheme,
        setDesignTheme,
    }:{
        generateDesignsConstraints: () => string,
        editor: Editor | null,
        systemPrompt?: string,
        userPrompt?: string,
        specificationPrompt?: string,
        UIScreensPrompt?: string,
        max_tokens?: number,
        temperature?: number,
        model?: string,
        dataSetScreens: string[],
        industry: string,
        setIndustry: (value: string) => void,
        productPurpose: string,
        setProductPurpose: (value: string) => void,
        targetAudience: string,
        setTargetAudience: (value: string) => void,
        device: string,
        setDevice: (value: string) => void,
        screen_type: string,
        setScreenType: (value: string) => void,
        colors: Color[],
        setColors: (value: Color[]) => void,
        fonts: string[],
        setFonts: (value: string[]) => void,
        style: string,
        setStyle: (value: string) => void,
        otherRequirements: string,
        setOtherRequirements: (value: string) => void,
        logoURL: string,
        lockedFields: Set<string>,
        toggleLock: (field: string) => void,
        handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
        handleDeleteLogo: () => void,
        importSettings: (e: React.ChangeEvent<HTMLInputElement>) => void,
        selectedSidebar:string,
        settings: any,
        designTheme: any,
        setDesignTheme: (value: any) => void,
    }
){

    const {
        data: businessIndustry,
        error: industriesError,
        isLoading: industriesLoading,
    } = useQuery({ queryKey: ['industries'], queryFn: () => fetchindustries() });

    const {
        data: UITypes,
        error: screenTypesError,
        isLoading: screenTypesLoading,
    } = useQuery({ queryKey: ['screen_types'], queryFn: () => fetchScreenTypes() });



    if (selectedSidebar !=="settings") return null;

    return (
        <aside className="w-80 bg-white border-r">
            <div className="overflow-y-scroll h-5/6">
                <div className="space-y-4 border-b-2 border-[#E0E0E0] pb-5 px-3 pt-5">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                            <Label htmlFor="industry">Select your industry:</Label>
                                <button onClick={() => toggleLock("industry")} className="text-gray-500">
                                    {lockedFields.has("industry") ? <CloseLock className="h-5 w-5" /> : <OpenLock className="h-5 w-5" />}
                                </button>
                            </div>
                            <Select onValueChange={(value) => setIndustry(value)} value={industry} disabled={lockedFields.has("industry")}>
                                <SelectTrigger id="industry">
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                    {businessIndustry && businessIndustry.map((item) => (
                                        <SelectItem key={item.id} value={`${item.id}-${item.name}`}>{item.name}</SelectItem>
                                    ))}
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                            <Label htmlFor="product-purpose">What's the main goal of your product?</Label>
                                <button onClick={() => toggleLock("productPurpose")} className="text-gray-500">
                                    {lockedFields.has("productPurpose") ? <CloseLock className="h-5 w-5" /> : <OpenLock className="h-5 w-5" />}
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
                            <Label htmlFor="target-audience">Who will use your product?</Label>
                                <button onClick={() => toggleLock("targetAudience")} className="text-gray-500">
                                    {lockedFields.has("targetAudience") ? <CloseLock className="h-5 w-5" /> : <OpenLock className="h-5 w-5" />}
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
                </div>
                <div className="space-y-4 border-b-2 border-[#E0E0E0] pb-5 px-3 pt-5">
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="device"> Choose the device type:</Label>
                            <button onClick={() => toggleLock("device")} className="text-gray-500">
                                {lockedFields.has("device") ? <CloseLock className="h-5 w-5" /> : <OpenLock className="h-5 w-5" />}
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
                            <Label htmlFor="screen_type">Select a screen type:</Label>
                            <button onClick={() => toggleLock("screen_type")} className="text-gray-500">
                                {lockedFields.has("screen_type") ? <CloseLock className="h-5 w-5" /> : <OpenLock className="h-5 w-5" />}
                            </button>
                        </div>
                        <Select onValueChange={(value) => setScreenType(value)} value={screen_type} disabled={lockedFields.has("screen_type")}>
                            <SelectTrigger id="screen_type">
                                <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                                {UITypes && UITypes.map((item) => (
                                    <SelectItem key={item.id} value={`${item.id}-${item.name}`}>{item.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="anything-else">Any specific features you need:</Label>
                            <button onClick={() => toggleLock("otherRequirements")} className="text-gray-500">
                                {lockedFields.has("otherRequirements") ? <CloseLock className="h-5 w-5" /> : <OpenLock className="h-5 w-5" />}
                            </button>
                        </div>
                        <Textarea
                            id="anything-else"
                            placeholder="Describe in details any specific features you need"
                            value={otherRequirements}
                            onChange={(e) => setOtherRequirements(e.target.value)}
                            disabled={lockedFields.has("otherRequirements")}
                        />
                    </div>
                </div>

                <div className="space-y-4 border-b-2 border-[#E0E0E0] pb-5 px-3 pt-5">
                    <div className="space-y-2">
                        <div className="flex items-center">
                            <Label htmlFor="colors">Have a preferred theme?</Label>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <HelpCircle className="h-4 w-4 ml-2 text-gray-500 cursor-help" />
                                    </TooltipTrigger>
                                    <TooltipContent side="right" className="z-[9999] max-w-[300px]">
                                        <p>Select a theme to bring the feel of popular design systems to your designs. <br></br>You can still choose your own fonts and colors, which will replace the theme's defaults.</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                        <ThemeSelector theme={designTheme} setTheme={setDesignTheme} />
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="colors">Choose Your Colors:</Label>
                            <button onClick={() => toggleLock("colors")} className="text-gray-500">
                                {lockedFields.has("colors") ? <CloseLock className="h-5 w-5" /> : <OpenLock className="h-5 w-5" />}
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
                            <Label htmlFor="fonts">Select a font style:</Label>
                            <button onClick={() => toggleLock("fonts")} className="text-gray-500">
                                {lockedFields.has("fonts") ? <CloseLock className="h-5 w-5" /> : <OpenLock className="h-5 w-5" />}
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
                            <Label htmlFor="style">Have a preferred style?</Label>
                            <button onClick={() => toggleLock("style")} className="text-gray-500">
                                {lockedFields.has("style") ? <CloseLock className="h-5 w-5" /> : <OpenLock className="h-5 w-5" />}
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
                            <Label className="text-sm font-medium">Upload your logo:</Label>
                        </div>
                        {logoURL ? (
                            <div className="h-16 bg-gray-200 rounded-lg flex items-center justify-center relative">
                                <img src={logoURL} alt="logo" className="h-16" />
                                <DeleteIcon className="absolute top-0 right-0 h-4 w-4 cursor-pointer" onClick={handleDeleteLogo} />
                            </div>
                        ) : (
                            <Button variant="outline" className="w-full" onClick={() => document.getElementById('logo-upload')?.click()}>
                                Click to upload
                                <input type="file" accept="image/*" onChange={handleFileChange} id="logo-upload" className="hidden" />
                                <PlusIcon className="ml-2 h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </div>


            </div>
            <div className="flex flex-col space-y-2 mt-4  pb-5 px-3 pt-5">
                <MakeRealButton
                    generateDesignsConstraints={generateDesignsConstraints}
                    editor={editor}
                    systemPrompt={systemPrompt}
                    userPrompt={userPrompt}
                    UIScreensPrompt={UIScreensPrompt}
                    specificationPrompt={specificationPrompt}
                    max_tokens={max_tokens}
                    temperature={temperature}
                    model={model}
                    UIScreens={dataSetScreens}
                    settings={settings}
                />
                <div className="flex space-x-2 justify-between">
                    <Button variant={"outline"} onClick={() => { document.getElementById('import-settings')?.click() }} style={{
                        backgroundColor: "#f9fafb",
                    }}>
                        <input type="file" onChange={importSettings} className="hidden" id="import-settings" />
                        Import Settings
                    </Button>
                    <Button variant={"outline"} 
                    onClick={() => exportSettings({ toFile: true, industry, colors, fonts, device, style, screen_type, targetAudience, productPurpose, otherRequirements, logoURL, lockedFields,designTheme })}>
                        Export Settings
                    </Button>
                </div>
            </div>
        </aside>
    )
}