'use client';

import {  } from 'next/navigation'

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"

// Define model options by provider
const modelOptions = {
    openai: [
        { value: 'gpt-4o', label: 'GPT-4o' },
        { value: 'gpt-4o-mini', label: 'GPT-4o Mini' },
    ],
    claude: [
        { value: 'claude-3-7-sonnet-20250219', label: 'Claude 3.7 Sonnet' },
        { value: 'claude-3-5-sonnet-20241022', label: 'Claude 3.5 Sonnet' },
    ]
};

export default function Component({
    systemPrompt,
    userPrompt,
    specificationPrompt,
    UIScreensPrompt,
    max_tokens,
    temperature,
    model,
    provider,
    setSystemPrompt,
    setUserPrompt,
    setSpecificationPrompt,
    setUIScreensPrompt,
    setMaxTokens,
    setTemperature,
    setModel,
    setProvider,
}:{
        systemPrompt?: string,
        userPrompt?: string,
        specificationPrompt?: string,
        UIScreensPrompt?: string,
        max_tokens?: number,
        temperature?: number,
        model?: string,
        provider?: string,
        setSystemPrompt: (value: string) => void,
        setUserPrompt: (value: string) => void,
        setSpecificationPrompt: (value: string) => void,
        setUIScreensPrompt: (value: string) => void,
        setMaxTokens: (value: number) => void,
        setTemperature: (value: number) => void,
        setModel: (value: string) => void,
        setProvider: (value: string) => void,
   
}) {
    const [isOpen, setIsOpen] = useState(false)
    const currentProvider = provider || 'openai'
    
    const handleProviderChange = (value: string) => {
        setProvider(value)
        // Set the first model in the list as default
        if (modelOptions[value as keyof typeof modelOptions]?.length > 0) {
            setModel(modelOptions[value as keyof typeof modelOptions][0].value)
        }
    }
   
    return (
        <>
                <Button onClick={() => setIsOpen(true)} className="fixed bottom-4 right-4">
                    Open Settings
                </Button>
            <div className="fixed top-0 right-0 h-screen w-80 bg-background p-4 overflow-scroll shadow-xl" style={{ transform: `translateX(${isOpen ? '0' : '100%'})`, transition: 'transform 0.3s' }}>
                <div className="flex justify-between">
                    <h3 className="text-lg font-semibold">Settings</h3>
                    <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                        <XIcon className="h-4 w-4" />
                        <span className="sr-only">Close</span>
                    </Button>
                </div>
                <Collapsible defaultOpen>
                    <CollapsibleTrigger className="flex justify-between py-2">
                        <span>Prompts</span>
                        <ChevronDownIcon className="h-4 w-4 transition-transform" />
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <Label htmlFor="System Prompt" className="text-muted-foreground">
                            System Prompt
                        </Label>
                        <Textarea
                            placeholder="Enter your system prompt..."
                            value={systemPrompt}
                            onChange={(e) => setSystemPrompt(e.target.value)}
                            rows={10}
                            className="w-full resize-none rounded-md border border-input px-3 py-2 shadow-sm"
                        />


                        <Label htmlFor="User Prompt" className="text-muted-foreground">
                            User Prompt
                        </Label>
                        <Textarea
                            placeholder="Enter your user prompt..."
                            value={userPrompt}
                            onChange={(e) => setUserPrompt(e.target.value)}
                            rows={10}
                            className="w-full resize-none rounded-md border border-input px-3 py-2 shadow-sm mt-4"
                        />

                        <Label htmlFor="Specification Prompt" className="text-muted-foreground">
                            Specification Prompt
                        </Label>

                        <Textarea
                            placeholder="Enter your specification prompt..."
                            value={specificationPrompt}
                            onChange={(e) => setSpecificationPrompt(e.target.value)}
                            rows={4}
                            className="w-full resize-none rounded-md border border-input px-3 py-2 shadow-sm mt-4"
                        />

                        <Label htmlFor="UI Screens Prompt" className="text-muted-foreground">
                            UI Screens Prompt
                        </Label>
                        <Textarea
                            placeholder="Enter your UI Screens prompt..."
                            value={UIScreensPrompt}
                            onChange={(e) => setUIScreensPrompt(e.target.value)}
                            rows={5}
                            className="w-full resize-none rounded-md border border-input px-3 py-2 shadow-sm mt-4"
                        />
                    </CollapsibleContent>
                </Collapsible>
                <Collapsible defaultOpen>
                    <CollapsibleTrigger className="flex justify-between py-2">
                        <span>Model Settings</span>
                        <ChevronDownIcon className="h-4 w-4 transition-transform" />
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <div className="grid gap-4 mt-2">
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="Provider" className="text-muted-foreground">
                                    Provider
                                </Label>
                                <Select value={currentProvider} onValueChange={handleProviderChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select provider" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="openai">OpenAI</SelectItem>
                                            <SelectItem value="claude">Claude</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                            
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="Model" className="text-muted-foreground">
                                    Model
                                </Label>
                                <Select 
                                    value={model} 
                                    onValueChange={setModel}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select model" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>{currentProvider === 'openai' ? 'OpenAI Models' : 'Claude Models'}</SelectLabel>
                                            {modelOptions[currentProvider as keyof typeof modelOptions]?.map(modelOption => (
                                                <SelectItem key={modelOption.value} value={modelOption.value}>
                                                    {modelOption.label}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CollapsibleContent>
                </Collapsible>
                <Collapsible defaultOpen>
                    <CollapsibleTrigger className="flex justify-between py-2">
                        <span>Other Settings</span>
                        <ChevronDownIcon className="h-4 w-4 transition-transform" />
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <div className="grid gap-4">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="Max Tokens" className="text-muted-foreground">
                                    Max Tokens
                                </Label>
                                <Input
                                    id="topP"
                                    type="number"
                                    value={max_tokens}
                                    onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                                    min={1}
                                    max={4096}
                                    className="w-24 rounded-md border border-input px-3 py-2 shadow-sm"
                                />
                            </div>
                        </div>
                        <div className="grid gap-4 mt-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="Temperature" className="text-muted-foreground">
                                    Temperature
                                </Label>
                                <div className="flex items-center gap-2">
                                    <Input
                                        type="number"
                                        value={temperature}
                                        onChange={(e) => setTemperature(parseFloat(e.target.value))}
                                        min={0}
                                        max={1}
                                        step={0.1}
                                        className="w-24 rounded-md border border-input px-3 py-2 shadow-sm"
                                    />
                                </div>
                            </div>
                        </div>
                    </CollapsibleContent>
                </Collapsible>
            </div>
        </>
    )
}

function ChevronDownIcon(props:any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m6 9 6 6 6-6" />
        </svg>
    )
}


function XIcon(props:any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
        </svg>
    )
}