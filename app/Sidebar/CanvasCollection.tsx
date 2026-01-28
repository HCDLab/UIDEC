'use client';

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Editor } from "@tldraw/tldraw";
import pb from "@/client/pocketBase";
import { toast } from "sonner";

const LoadButton = ({ documentId, editor, setSelectedSidebar, importSettingsFromSavedCollection }: {
    documentId: string,
    editor: Editor | null,
    importSettingsFromSavedCollection: (settings: any) => void,
   setSelectedSidebar: (value: string) => void,
}) => {

    if (!editor) return

    const loadCanvas = async () => {
        const canvas = await pb.collection('saved_canvas').getFirstListItem(`id="${documentId}"`);
        if (!canvas) return;
        editor.loadSnapshot({
            document: canvas.canvas,
            session: canvas.session
        });
        console.log('canvas.settings', canvas.settings)
        importSettingsFromSavedCollection(canvas.settings)
        setSelectedSidebar("settings")
    };

    return (
        <Button onClick={loadCanvas} variant={"default"}>
            Load Canvas
        </Button>
    );
}

const DeleteButton = ({ documentId, setSelectedCanvas }: {
    documentId: string,
    setSelectedCanvas: (value: string | null) => void,
}) => {

    const queryClient = useQueryClient()

    const deleteCanvas = async () => {
        await pb.collection('saved_canvas').delete(documentId);
        queryClient.invalidateQueries({ queryKey: ['saved_canvas'] })
        setSelectedCanvas(null)
        toast('Canvas deleted', {
            duration: 3000,
        })
    };

    return (
        <Button onClick={deleteCanvas} variant={"destructive"}>
            Delete
        </Button>
    );
}

const getUserCanvases = async (userId: string) => {
    const canvases = await pb.collection('saved_canvas').getFullList({ user_id: userId });
    if (!canvases) return [];
    return canvases;

}
const groupCanvasesByDateRange = (canvases: any[]) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const previous7Days = new Date(today);
    previous7Days.setDate(previous7Days.getDate() - 7);
    const previous30Days = new Date(today);
    previous30Days.setDate(previous30Days.getDate() - 30);

    const isSameDay = (d1: Date, d2: Date) =>
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate();

    const isInRange = (d: number | Date, start: number | Date, end: number | Date) =>
        d > start && d <= end;

    const toLocalTime = (utcDateString: string | number | Date) => {
        const utcDate = new Date(utcDateString);
        return new Date(utcDate.getTime() - (utcDate.getTimezoneOffset() * 60000));
    }

    const groupedCanvases = {
        today: canvases.filter(canvas => isSameDay(toLocalTime(canvas.updated), today)),
        yesterday: canvases.filter(canvas => isSameDay(toLocalTime(canvas.updated), yesterday)),
        previous7Days: canvases.filter(canvas => isInRange(toLocalTime(canvas.updated), previous7Days, yesterday)),
        previous30Days: canvases.filter(canvas => isInRange(toLocalTime(canvas.updated), previous30Days, previous7Days)),
    };

    return groupedCanvases;
}



export default function CanvasCollection({
    editor,
    user_id,
    savedEditor,
    setSelectedSidebar,
    selectedSidebar,
    importSettingsFromSavedCollection,
}: {
    editor: any,
    user_id: string,
    savedEditor: any,
    setSelectedSidebar: (value: string) => void,
    selectedSidebar: string,
    importSettingsFromSavedCollection : (settings: any) => void
}) {



    const [selectedCanvas, setSelectedCanvas] = useState<string | null>(null)
    const [canvases, setCanvases] = useState<{ today: any[]; yesterday: any[]; previous7Days: any[]; previous30Days: any[]; }>({ today: [], yesterday: [], previous7Days: [], previous30Days: [] })
    const [loading, setLoading] = useState(false)

    const {
        data: canvasesData,
        error: canvasesError,
        isLoading: canvasesIsLoading,
    } = useQuery({ queryKey: ['saved_canvas'], queryFn: () => getUserCanvases(user_id) })


    useEffect(() => {
        const loadCanvas = async () => {
            if (!selectedCanvas) return;
            try {
                const canvas = await pb.collection('saved_canvas').getFirstListItem(`id="${selectedCanvas}"`);
                if (!canvas) return;
                savedEditor.loadSnapshot({
                    document: canvas.canvas,
                    session: canvas.session
                });
            } catch (error) {
                toast('Failed to load canvas: ' + error, 
                {
                    duration: 3000,
                });
            }
        };

        loadCanvas();
    }, [selectedCanvas]);

    useEffect(() => {
        if (canvasesData) {
            setCanvases(groupCanvasesByDateRange(canvasesData))
        }
    }
    , [canvasesData])

    if (selectedSidebar !== 'saved_canvas') return null;
    if (canvasesIsLoading) return <aside className="w-64 p-4 border-r bg-white">
        <div>Loading...</div>
    </aside>
    if (canvasesError) return <aside className="w-64 p-4 border-r bg-white">
        <div>Error: {canvasesError.message}</div>
    </aside>
    if (!canvases.today.length && !canvases.yesterday.length && !canvases.previous7Days.length && !canvases.previous30Days.length) {
        return <aside className="w-64 p-4 border-r bg-white">
            <div>No saved canvases</div>
        </aside>
    }

    return (
        <aside className="w-64 p-4 border-r bg-white">
            <div className="space-y-4 overflow-auto h-5/6 p-2">
                <div className="flex items-center justify-between mb-4">
                    <Button onClick={() => {
                        setSelectedCanvas(null)
                        setSelectedSidebar("settings")
                    }
                    } variant="outline" size="icon">
                        <ChevronLeftIcon className="w-4 h-4" />
                    </Button>
                </div>
                <div className="space-y-4">
                    {canvases.today.length > 0 && (
                        <div>
                            <h2 className="text-sm font-semibold text-muted-foreground">Today</h2>
                            <ul className="space-y-2">
                                {canvases.today.map(canvas => (
                                    <li key={canvas.id} onClick={() => setSelectedCanvas(canvas.id)}>
                                        <a href="#" className={`flex items-center justify-between p-2 text-sm  ${selectedCanvas === canvas.id ? 'bg-gray-100' : ''}`}>
                                            {canvas.name}
                                            <ChevronRightIcon className="w-4 h-4" />
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {canvases.yesterday.length > 0 && (
                        <div>
                            <h2 className="text-sm font-semibold text-muted-foreground">Yesterday</h2>
                            <ul className="space-y-2">
                                {canvases.yesterday.map(canvas => (
                                    <li key={canvas.id} onClick={() => setSelectedCanvas(canvas.id)}>
                                        <a href="#" className={`flex items-center justify-between p-2 text-sm  ${selectedCanvas === canvas.id ? 'bg-gray-100' : ''}`}>
                                            {canvas.name}
                                            <ChevronRightIcon className="w-4 h-4" />
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {canvases.previous7Days.length > 0 && (
                        <div>
                            <h2 className="text-sm font-semibold text-muted-foreground">Previous 7 days</h2>
                            <ul className="space-y-2">
                                {canvases.previous7Days.map(canvas => (
                                    <li key={canvas.id} onClick={() => setSelectedCanvas(canvas.id)}>
                                        <a href="#" className={`flex items-center justify-between p-2 text-sm  ${selectedCanvas === canvas.id ? 'bg-gray-100' : ''}`}>
                                            {canvas.name}
                                            <ChevronRightIcon className="w-4 h-4" />
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {canvases.previous30Days.length > 0 && (
                        <div>
                            <h2 className="text-sm font-semibold text-muted-foreground">Previous 30 days</h2>
                            <ul className="space-y-2">
                                {canvases.previous30Days.map(canvas => (
                                    <li key={canvas.id} onClick={() => setSelectedCanvas(canvas.id)}>
                                        <a href="#" className={`flex items-center justify-between p-2 text-sm  ${selectedCanvas === canvas.id ? 'bg-gray-100' : ''}`}>
                                            {canvas.name}
                                            <ChevronRightIcon className="w-4 h-4" />
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                </div>
            </div>
            <div className="flex flex-col space-y-2 mt-4">
                {selectedCanvas ? <div className="flex space-x-4">
                    <DeleteButton documentId={selectedCanvas} setSelectedCanvas={setSelectedCanvas} />
                    <LoadButton documentId={selectedCanvas} editor={editor} setSelectedSidebar={setSelectedSidebar} importSettingsFromSavedCollection={importSettingsFromSavedCollection} />
                </div> : null}
            </div>
        </aside>
    )
}