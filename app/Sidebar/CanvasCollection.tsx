'use client';

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Editor } from "@tldraw/tldraw";
import pb from "@/client/pocketBase";

const LoadButton = ({ documentId, editor, setToggleSidebar }: {
    documentId: string,
    editor: Editor | null,
    setToggleSidebar: (isOpen: boolean) => void
}) => {

    if (!editor) return

    const loadCanvas = async () => {
        const canvas = await pb.collection('saved_canvas').getFirstListItem(`id="${documentId}"`);
        if (!canvas) return;
        editor.loadSnapshot({
            document: canvas.canvas,
            session: canvas.session
        });
        setToggleSidebar(false)
    };

    return (
        <Button onClick={loadCanvas} className="">
            Load Canvas
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
    isOpen,
    setToggleSidebar,
    savedEditor,
}: {
    editor: any,
    user_id: string,
    isOpen: boolean,
    setToggleSidebar: (isOpen: boolean) => void,
    savedEditor: any,
}) {



    const [selectedCanvas, setSelectedCanvas] = useState<string | null>(null)
    const [canvases, setCanvases] = useState<{ today: any[]; yesterday: any[]; previous7Days: any[]; previous30Days: any[]; }>({ today: [], yesterday: [], previous7Days: [], previous30Days: [] })
    const [loading, setLoading] = useState(false)

    const fetchCanvases = async () => {
        setLoading(true)
        const canvases = await getUserCanvases(user_id)
        const groupedCanvases = groupCanvasesByDateRange(canvases)
        setCanvases(groupedCanvases)
        setLoading(false)
    }

    useEffect(() => {
        fetchCanvases()
    }, [])

    useEffect(() => {
        const loadCanvas = async () => {
            if (!selectedCanvas) return;
            try {
                const canvas = await pb.collection('saved_canvas').getFirstListItem(`id="${selectedCanvas}"`);
                if (!canvas) return;
                console.log('canvas', canvas)
                savedEditor.loadSnapshot({
                    document: canvas.canvas,
                    session: canvas.session
                });
            } catch (error) {
                console.error('Failed to load canvas:', error);
            }
        };

        loadCanvas();
    }, [selectedCanvas]);

    if (!isOpen) return null

    if (loading) return <div>Loading...</div>

    if (!canvases.today.length && !canvases.yesterday.length && !canvases.previous7Days.length && !canvases.previous30Days.length) {
        return <div>No canvases found</div>
    }



    return (
        <aside className="w-64 p-4 border-r bg-white">

            <div className="flex items-center justify-between mb-4">
                <Button onClick={() => {
                    setSelectedCanvas(null)
                    setToggleSidebar(false)
                }
                } variant="outline" size="icon">
                    <ChevronLeftIcon className="w-4 h-4" />
                </Button>
            </div>

            <div className="space-y-4">
                {canvases.today.length > 0 && (
                    <div>
                        <h2 className="text-sm font-semibold">Today</h2>
                        <ul className="space-y-2">
                            {canvases.today.map(canvas => (
                                <li key={canvas.id} onClick={() => setSelectedCanvas(canvas.id)}>
                                    <a href="#" className={`flex items-center justify-between p-2 text-sm text-muted-foreground ${selectedCanvas === canvas.id ? 'bg-gray-100' : ''}`}>
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
                        <h2 className="text-sm font-semibold">Yesterday</h2>
                        <ul className="space-y-2">
                            {canvases.yesterday.map(canvas => (
                                <li key={canvas.id} onClick={() => setSelectedCanvas(canvas.id)}>
                                    <a href="#" className={`flex items-center justify-between p-2 text-sm text-muted-foreground ${selectedCanvas === canvas.id ? 'bg-gray-100' : ''}`}>
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
                        <h2 className="text-sm font-semibold">Previous 7 days</h2>
                        <ul className="space-y-2">
                            {canvases.previous7Days.map(canvas => (
                                <li key={canvas.id} onClick={() => setSelectedCanvas(canvas.id)}>
                                    <a href="#" className={`flex items-center justify-between p-2 text-sm text-muted-foreground ${selectedCanvas === canvas.id ? 'bg-gray-100' : ''}`}>
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
                        <h2 className="text-sm font-semibold">Previous 30 days</h2>
                        <ul className="space-y-2">
                            {canvases.previous30Days.map(canvas => (
                                <li key={canvas.id} onClick={() => setSelectedCanvas(canvas.id)}>
                                    <a href="#" className={`flex items-center justify-between p-2 text-sm text-muted-foreground ${selectedCanvas === canvas.id ? 'bg-gray-100' : ''}`}>
                                        {canvas.name}
                                        <ChevronRightIcon className="w-4 h-4" />
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                {selectedCanvas ? <LoadButton documentId={selectedCanvas} editor={editor} setToggleSidebar={setToggleSidebar} /> : null}
            </div>
        </aside>
    )
}