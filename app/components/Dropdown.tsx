import * as DropdownMenu from '@radix-ui/react-dropdown-menu'

import { CircleX, Heart, Info } from 'lucide-react'

import { stopEventPropagation } from 'tldraw'
import { toast } from 'sonner'
import { useCallback } from 'react'

export function Dropdown({
    boxShadow,
    html,
}: {
    boxShadow: string
    html: string
}) {
    

    const handleDelete = useCallback(() => {
        toast('deleted', {
            duration: 3000,
        })
    }, [toast])

    const handleSave = useCallback(() => {
        toast('Folder saved', {
            duration: 3000,
        })
    }, [toast])


    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild></DropdownMenu.Trigger>
            <DropdownMenu.Portal>
                <DropdownMenu.Content side="right" sideOffset={10} align="start">
                    <div
                        style={{ boxShadow, pointerEvents: 'all', background: '#fdfdfd' }}
                        className="flex items-start flex-col text-xs bg-white rounded-[9px] w-full p-1"
                    >
                        <div
                            style={{
                                height: '1px',
                                margin: '4px -4px',
                                width: 'calc(100% + 8px)',
                                background: '#e8e8e8',
                            }}
                        ></div>
                        <div className="">
                            <button
                                className=" p-2"
                                onPointerDown={stopEventPropagation}
                                onClick={handleDelete}
                            > <CircleX />
                            </button>
                            <button
                                className=" p-2"
                                onPointerDown={stopEventPropagation}
                                onClick={handleSave}>
                                <Heart />
                            </button>
                            <button
                                className=" p-2"
                                onPointerDown={stopEventPropagation}
                            > <Info />
                            </button>

                        </div>
                    </div>
                </DropdownMenu.Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    )
}

function Item({ action, children }: { action: () => void; children: React.ReactNode }) {
    return (
        <DropdownMenu.Item asChild>
            <button
                onPointerDown={stopEventPropagation}
                onClick={action}
                onTouchEnd={action}
                className=" hover:bg-gray-100 outline-none h-9 px-3 text-left w-full rounded-md box-border"
                style={{
                    textShadow: '1px 1px #fff',
                }}
            >
                {children}
            </button>
        </DropdownMenu.Item>
    )
}