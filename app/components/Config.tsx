import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"

export default function Component({
    systemPrompt,
    userPrompt,
    specificationPrompt,
    UIScreensPrompt,
    max_tokens,
    temperature,
    model,
    setSystemPrompt,
    setUserPrompt,
    setSpecificationPrompt,
    setUIScreensPrompt,
    setMaxTokens,
    setTemperature,
    setModel,
}:{
        systemPrompt?: string,
        userPrompt?: string,
        specificationPrompt?: string,
        UIScreensPrompt?: string,
        max_tokens?: number,
        temperature?: number
        model?: string
        setSystemPrompt: (value: string) => void
        setUserPrompt: (value: string) => void
        setSpecificationPrompt: (value: string) => void
        setUIScreensPrompt: (value: string) => void
        setMaxTokens: (value: number) => void
        setTemperature: (value: number) => void
        setModel: (value: string) => void
   
}) {
    const [isOpen, setIsOpen] = useState(false)
   
    return (
        <>
            <Button  onClick={() => setIsOpen(true)} className="fixed bottom-4 right-4">
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