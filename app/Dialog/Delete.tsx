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
            <div className="bg-white p-6 rounded-lg shadow-lg z-10 w-2/6">
                <h2 className="text-2xl font-bold">Discard Design?</h2>
                <div className="mt-4 flex justify-end space-x-2">
                    <Button onClick={onCancel} variant={"secondary"}>Cancel</Button>
                    <Button onClick={onConfirm} variant={"default"}>Yes</Button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationDialog;