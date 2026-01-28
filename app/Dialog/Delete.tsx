import { Button } from '@/components/ui/button';
import React from 'react';

interface DeleteConfirmationDialogProps {
    onConfirm: () => void;
    onCancel: () => void;
    stopEventPropagation: (e: React.PointerEvent) => void;
}

const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({ onConfirm, onCancel, stopEventPropagation }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center " style={{
            zIndex: 9999
        }}
            onPointerDown={stopEventPropagation}
        >
            <div className="bg-black bg-opacity-50 absolute inset-0"></div>
            <div className="bg-white p-6 rounded-lg shadow-lg z-10 w-full max-w-[600px]">
                <h2 className="text-3xl font-bold">Discard Design?</h2>
                <p className="text-2xl mt-4">Are you sure you want to discard this design?</p>
                <div className="mt-4 flex justify-end space-x-2">
                    <Button onClick={onCancel} variant={"secondary"} size={"lg"} className="text-2xl">Cancel</Button>
                    <Button onClick={onConfirm} variant={"default"} size={"lg"} className="text-2xl">Yes</Button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationDialog;