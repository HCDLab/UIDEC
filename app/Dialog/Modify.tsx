'use client';

import { Input } from "@/components/ui/input";
import { TLShapeId } from "@tldraw/tldraw";
import UpdateDesignButton from "../components/UpdateDesignButton";
import { useState } from "react";
const modifyOptions = [
    "Change it completely",
    "Make it smaller",
    "Make it large",
    "Change the color",
    "Change the typography"
];

function ModifyComponent({ stopEventPropagation, selectedElement, editor, shapeID, originalHTML}:{
    stopEventPropagation: (e: React.PointerEvent) => void;
    selectedElement: any;
    editor: any
    shapeID: TLShapeId
    originalHTML: string
}) {

    const [requestedModification, setRequestedModification] = useState<string>("");
    return (
        <section className="flex flex-col p-4 text-xs font-medium leading-3 bg-white rounded-2xl min-w-[300px] text-neutral-700" onPointerDown={stopEventPropagation}>
            <h2 className="mt-3 text-xs font-semibold leading-4 text-zinc-500">
                How do you like to modify it?
            </h2>
            <div className="flex flex-col mt-3">
                {modifyOptions.map((option, index) => (
                    <UpdateDesignButton styles="justify-center px-2 py-2.5 mt-1.5 rounded-lg bg-zinc-100 text-gray-400 hover:bg-zinc-200 hover:text-gray-400" editor={editor} selectedElement={selectedElement} shapeID={shapeID} originalHTML={originalHTML} modifications={option} buttonText={option} />
                ))}
            </div>
            <p className="mt-3 text-xs leading-4 text-zinc-500">
                or anything else it mind?
            </p>
            <form className="mb-4">
                <label htmlFor="productPurpose" className="sr-only">
                    Enter your modification
                </label>
                <Input
                    type="text"
                    value={requestedModification}
                    id="requestedModification"
                    placeholder="Enter your modification"
                    onChange={(e) => setRequestedModification(e.target.value)}
                />
            </form>
            <UpdateDesignButton editor={editor} selectedElement={selectedElement} shapeID={shapeID} originalHTML={originalHTML} modifications={requestedModification} buttonText={`Regenerate Design`} />
        </section>
    );
}

export default ModifyComponent;