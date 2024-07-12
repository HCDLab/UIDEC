'use client'

import { useEffect, useState } from 'react'

import CanvasCollection from './CanvasCollection';
import { Editor } from 'tldraw'
import Favorite from './Favorite';
import Settings from './Settings';
import pb from '@/client/pocketBase';
import { toast } from 'sonner';

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
    user_id,
    savedEditor,
    favoriteEditor,
    setSelectedSidebar,
    selectedSidebar,
    setSettings,
    settings,
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
    user_id: string,
    savedEditor: Editor | null,
    favoriteEditor: Editor | null,
    setSelectedSidebar: (value: string) => void,
    selectedSidebar: string,
    setSettings: (value: any) => void,
    settings: any,
}) {
    const [domain, setDomain] = useState("");
    const [designSystem, setDesignSystem] = useState("Tailwind CSS");
    const [colors, setColors] = useState<Color[]>([{ hex: '' }]);
    const [fonts, setFonts] = useState<string[]>(['']);
    const [device, setDevice] = useState("");
    const [style, setStyle] = useState("");
    const [screen_type, setScreenType] = useState("");
    const [targetAudience, setTargetAudience] = useState("");
    const [productPurpose, setProductPurpose] = useState("");
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
        if (targetAudience) {
            spec += `Target Audience: ${targetAudience}\n`;
        }
        if (productPurpose) {
            spec += `Product Purpose: ${productPurpose}\n`;
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
                    setTargetAudience(settings.targetAudience?.value || "");
                    setProductPurpose(settings.productPurpose?.value || "");
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
                        ...(settings.targetAudience?.status === "locked" ? ["targetAudience"] : []),
                        ...(settings.productPurpose?.status === "locked" ? ["productPurpose"] : []),
                        ...(settings.otherRequirements?.status === "locked" ? ["otherRequirements"] : []),
                        ...(settings.logoURL?.status === "locked" ? ["logo"] : []),
                    ]));
                    toast('Settings imported successfully', {
                        duration: 3000,
                    });
                }
            };
            reader.readAsText(file);
        }
    };

    const importSettingsFromSavedCollection = (settings:any) => {
        // Update states with values from settings
        setDomain(settings.domain?.value || "");
        setDesignSystem(settings.designSystem?.value || "");
        setColors(settings.colors?.map((color: any) => ({ hex: color.value })) || [{ hex: '' }]);
        setFonts(settings.fonts?.map((font: any) => font.value) || ['']);
        setDevice(settings.device?.value || "");
        setStyle(settings.style?.value || "");
        setScreenType(settings.screen_type?.value || "");
        setTargetAudience(settings.targetAudience?.value || "");
        setProductPurpose(settings.productPurpose?.value || "");
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
            ...(settings.targetAudience?.status === "locked" ? ["targetAudience"] : []),
            ...(settings.productPurpose?.status === "locked" ? ["productPurpose"] : []),
            ...(settings.otherRequirements?.status === "locked" ? ["otherRequirements"] : []),
            ...(settings.logoURL?.status === "locked" ? ["logo"] : []),
        ]));
        toast('Settings imported successfully', {
            duration: 3000,
        });

    };


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

    useEffect(() => {
        setSettings({
            domain: { value: domain, status: lockedFields.has("domain") ? "locked" : "unlocked" },
            designSystem: { value: designSystem, status: lockedFields.has("designSystem") ? "locked" : "unlocked" },
            colors: colors.map((color) => ({ value: color.hex, status: lockedFields.has("colors") ? "locked" : "unlocked" })),
            fonts: fonts.map((font) => ({ value: font, status: lockedFields.has("fonts") ? "locked" : "unlocked" })),
            device: { value: device, status: lockedFields.has("device") ? "locked" : "unlocked" },
            style: { value: style, status: lockedFields.has("style") ? "locked" : "unlocked" },
            screen_type: { value: screen_type, status: lockedFields.has("screen_type") ? "locked" : "unlocked" },
            targetAudience: { value: targetAudience, status: lockedFields.has("targetAudience") ? "locked" : "unlocked" },
            productPurpose: { value: productPurpose, status: lockedFields.has("productPurpose") ? "locked" : "unlocked" },
            otherRequirements: { value: otherRequirements, status: lockedFields.has("otherRequirements") ? "locked" : "unlocked" },
            logoURL: { value: logoURL, status: lockedFields.has("logo") ? "locked" : "unlocked" },
        });
    }, [domain, designSystem, colors, fonts, device, style, screen_type, targetAudience, productPurpose, otherRequirements, logoURL, lockedFields]);


    return (
        <>
            <Settings generateDesignsConstraints={generateDesignsConstraints} handleFileChange={handleFileChange} handleDeleteLogo={handleDeleteLogo} importSettings={importSettings} domain={domain} setDomain={setDomain} colors={colors} setColors={setColors} fonts={fonts} setFonts={setFonts} device={device} setDevice={setDevice} style={style} setStyle={setStyle} screen_type={screen_type} setScreenType={setScreenType} targetAudience={targetAudience} setTargetAudience={setTargetAudience} productPurpose={productPurpose} setProductPurpose={setProductPurpose} otherRequirements={otherRequirements} setOtherRequirements={setOtherRequirements} logoURL={logoURL} dataSetScreens={dataSetScreens} lockedFields={lockedFields} toggleLock={toggleLock} editor={editor} selectedSidebar={selectedSidebar} settings={settings} />

            <CanvasCollection user_id={user_id} editor={editor} savedEditor={savedEditor} selectedSidebar={selectedSidebar} setSelectedSidebar={setSelectedSidebar} importSettingsFromSavedCollection={importSettingsFromSavedCollection} />

            <Favorite selectedSidebar={selectedSidebar} setSelectedSidebar={setSelectedSidebar} user_id={user_id} favoriteEditor={favoriteEditor}/>
        </>

    );
}
