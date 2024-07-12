import { QueryClient, useQuery } from "@tanstack/react-query";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import pb from "@/client/pocketBase";
import { toast } from "sonner";
import { useState } from "react";

interface SaveDialogProps {
    onConfirm: () => void;
    onCancel: () => void;
    stopEventPropagation: (e: React.PointerEvent) => void;
    design: any;
}

const CANVAS_TEMPLATE = {
    "schema": {
        "schemaVersion": 2,
        "sequences": {}
    },
    "store": {}
};

const queryClient = new QueryClient();

const SaveDialog: React.FC<SaveDialogProps> = ({ onConfirm, onCancel, stopEventPropagation, design }) => {
    const [selectedFolder, setSelectedFolder] = useState<string>("");

    const fetchFavoritesUsersFolder = async () => {
        const folders = await pb.collection('favorites').getFullList({ user_id: pb.authStore.model?.id });
        if (!folders) return [];
        return folders;
    };

    const { data: folders, isLoading, error } = useQuery({ queryKey: ['favorites'], queryFn: () => fetchFavoritesUsersFolder() });

    if (!pb.authStore.model?.id) return null;

    const handleSave = async () => {
        if (selectedFolder === "default") {
            const canvas = CANVAS_TEMPLATE;
            canvas.store = {
                [design.id]: design
            };
            await pb.collection('favorites').create({
                user_id: pb.authStore.model?.id,
                name: 'My Favorites',
                canvas
            });
        } else {
            const favorite = await pb.collection('favorites').getFirstListItem(`id='${selectedFolder}'`);
            if (!favorite) return;
            const canvas = CANVAS_TEMPLATE;
            canvas.store = {
                ...favorite.canvas.store,
                [design.id]: design
            };
            await pb.collection('favorites').update(selectedFolder, {
                canvas
            });
        }
        toast(`Design added to Favorites folder`, {
            duration: 3000,
        });
        queryClient.invalidateQueries({ queryKey: ['favorites'] });
        onConfirm();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center" style={{ zIndex: 9998 }} onPointerDown={stopEventPropagation}>
            <div className="bg-black bg-opacity-50 absolute inset-0"></div>
            {isLoading && <div>Loading...</div>}
            {error && <div>Error: {error.message}</div>}
            {folders && (
                <div className="bg-white p-6 rounded-lg shadow-lg z-10 w-2/6">
                    <h2 className="text-2xl font-bold">Save to Favorites</h2>
                    <Select onValueChange={(value) => setSelectedFolder(value)} value={selectedFolder}>
                        <SelectTrigger id="selected_folder">
                            <SelectValue placeholder="Select a folder" />
                        </SelectTrigger>
                        <SelectContent style={{ zIndex: 9999 }}>
                            {folders.length === 0 && <SelectItem value="default">My Favorites</SelectItem>}
                            {folders.map((item) => (
                                <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <div className="mt-4 flex justify-end space-x-2">
                        <Button onClick={onCancel} variant={"secondary"}>Cancel</Button>
                        <Button onClick={handleSave} variant={"default"}>Save</Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SaveDialog;
