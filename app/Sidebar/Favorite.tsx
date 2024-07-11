import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button"
import { ChevronRightIcon } from "lucide-react";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import pb from "@/client/pocketBase";
import { toast } from "sonner";

export default function Favorite({
    selectedSidebar,
    setSelectedSidebar,
    user_id,
}: {
    selectedSidebar: string;
    setSelectedSidebar: (value: string) => void;
    user_id: string;
}) {

    const [loading, setLoading] = useState(false)
    const [favorites, setFavorites] = useState<any[]>([])
    const [selectedFolder, setSelectedFolder] = useState<string | null>(null)
    const [folderName, setFolderName] = useState<string>("")
    const queryClient = useQueryClient()


    const {
        data: favoritesData,
        isLoading: favoritesLoading,
        error: favoritesError,
    } = useQuery({ queryKey: ['favorites'], queryFn: () => getUserFavorites(user_id) })

    const createFavorite = async (userId: string, name: string) => {
        await pb.collection('favorites').create({
            user_id: userId,
            name: name,
        });
        toast('Folder created', {
            duration: 3000,
        })
        queryClient.invalidateQueries({ queryKey: ['favorites'] })
    }

    const getUserFavorites = async (userId: string) => {
        const canvases = await pb.collection('favorites').getFullList({ user_id: userId });
        if (!canvases) return [];
        return canvases;
    }

    const deleteUserFavorite = async (favoriteId: string) => {
        await pb.collection('favorites').delete(favoriteId);
        queryClient.invalidateQueries({ queryKey: ['favorites'] })
        toast('Folder deleted', {
            duration: 3000,
        })
        setSelectedFolder(null)
    }


    useEffect(() => {
        if (favoritesData) {
            setFavorites(favoritesData)
        }
    }, [favoritesData])


    if (selectedSidebar !== "favorite") return null;

    if (favoritesLoading) return <aside className="w-64 p-4 border-r">
        <div>Loading...</div>
    </aside>

    if (favoritesError) return <aside className="w-64 p-4 border-r">
        <div>Error: {favoritesError.message}</div>
    </aside>



    return (
        <aside className="w-64 p-4 border-r">
            <div className="space-y-4 overflow-auto h-5/6 p-2">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button className="w-full mb-4" variant="default">
                            New Folder
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                        <div className="grid gap-4">
                            <div className="space-y-2">
                                <h4 className="font-medium leading-none">Create New Folder</h4>
                            </div>
                            <div className="grid gap-2">
                                <div className="grid grid-cols-3 items-center gap-4">
                                    <Label htmlFor="width">Name</Label>
                                    <Input
                                        id="name"
                                        className="col-span-2 h-8"
                                        value={folderName}
                                        onChange={(e) => setFolderName(e.target.value)}
                                    />
                                </div>
                                <Button className="w-full mb-4" variant="default" onClick={() => createFavorite(user_id, folderName)}>
                                    Create
                                </Button>
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>
                <div className="space-y-2">
                    <h2 className="text-sm font-semibold text-muted-foreground">Folder</h2>
                    <ul className="space-y-2">
                        {favorites.map(favorite => (
                            <li key={favorite.id} onClick={() => {
                                setSelectedFolder(favorite.id)
                            }}>
                                <a href="#" className={`flex items-center justify-between p-2 text-sm  ${selectedFolder === favorite.id ? 'bg-gray-100' : ''}`}>
                                    {favorite.name}
                                    <ChevronRightIcon className="w-4 h-4" />
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="flex flex-col space-y-2 mt-4">
                {selectedFolder && (
                    <>
                        <Button className="w-full " variant="destructive" onClick={() => { deleteUserFavorite(selectedFolder) }}>
                            Delete Folder
                        </Button>
                    </>
                )}
            </div>
        </aside>
    );
}