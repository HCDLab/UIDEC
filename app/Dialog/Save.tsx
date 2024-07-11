import {
} from "@/components/ui/popover"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import pb from "@/client/pocketBase"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"

interface SaveDialogProps {
    onConfirm: () => void;
    onCancel: () => void;
    stopEventPropagation: (e: React.PointerEvent) => void;
}

const SaveDialog: React.FC<SaveDialogProps> = ({ onConfirm, onCancel, stopEventPropagation }) => {

    const fetchFavoritesUsersFolder = async (userId: string) => {
        const folders = await pb.collection('favorites').getFullList({ user_id: userId });
        if (!folders) return [];
        return folders;
    }

    const [selectedFolder, setSelectedFolder] = useState<string>("")

    const { data: folders, isLoading, error } = useQuery({ queryKey: ['favorites'], queryFn: () => fetchFavoritesUsersFolder('') })

    return (
        <div className="fixed inset-0 flex items-center justify-center " style={{
            zIndex: 9998
        }}
            onPointerDown={stopEventPropagation}
        >
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
                            {folders.map((item) => (
                                <SelectItem key={item.id} value={item.name}>{item.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <div className="mt-4 flex justify-end space-x-2">
                        <Button onClick={onCancel} variant={"secondary"}>Cancel</Button>
                        <Button onClick={onConfirm} variant={"default"}>Save</Button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SaveDialog;
