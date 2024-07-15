interface Color {
    hex: string;
}

import { DeleteIcon, Lock, PlusIcon, Unlock } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { UITypes, businessDomain, designStyles, deviceTypes } from './options';

import { Button } from "@/components/ui/button"
import ColorSelector from "./ColorSelector";
import FontSelector from './FontSelector';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label";
import { MakeRealButton } from "../components/MakeRealButton";
import { exportSettings } from '@/utils/utils';

export default function Settings(
    {
        generateDesignsConstraints,
        editor,
        systemPrompt,
        userPrompt,
        max_tokens,
        temperature,
        model,
        dataSetScreens,
        domain,
        setDomain,
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
    }:{
        generateDesignsConstraints: () => string,
        editor: any,
        systemPrompt?: string,
        userPrompt?: string,
        max_tokens?: number,
        temperature?: number,
        model?: string,
        dataSetScreens: string[],
        domain: string,
        setDomain: (value: string) => void,
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
    }
){
    if (selectedSidebar !=="settings") return null;

    return (
        <aside className="w-80 p-2 bg-gray-100 border-r">
            <div className="space-y-4 overflow-y-scroll h-5/6 pl-2 pr-4">
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
                            <img src={logoURL} alt="logo" className="w-16 h-16" />
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
                    onClick={() => exportSettings({ toFile: true, domain, designSystem:"tailwind css", colors, fonts, device, style, screen_type, targetAudience, productPurpose, otherRequirements, logoURL, lockedFields })}>
                        Export Settings
                    </Button>
                </div>
            </div>
        </aside>
    )
}