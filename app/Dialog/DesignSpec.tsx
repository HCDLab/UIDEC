import { Button } from "@/components/ui/button";

interface SaveDialogProps {
    onCancel: () => void;
    stopEventPropagation: (e: React.PointerEvent) => void;
    settings: any;
}

const formatKey = (key: string) => {
    return key
        .replace(/([A-Z])/g, ' $1') // Add space before capital letters
        .replace(/^./, (str) => str.toUpperCase()) // Capitalize the first letter
        .replace("_", " ");
};

const DesignSpecs: React.FC<SaveDialogProps> = ({ onCancel, stopEventPropagation, settings }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center" style={{ zIndex: 9998 }} onPointerDown={stopEventPropagation}>
            <div className="bg-black bg-opacity-50 absolute inset-0"></div>
            <div className="bg-white p-6 rounded-lg shadow-lg z-10 w-auto">
                <h2 className="text-xl font-bold">Design Specs</h2>
                {settings && Object.keys(settings).map((key) => (
                    <div key={key} className="flex justify-between items-center mt-2">
                        <span className="text-sm">{formatKey(key)}</span>
                        <span className="text-sm flex items-center">
                            {key === 'logoURL' && settings[key].value && (
                                <figure className=" max-w-sm">
                                <img src={settings[key].value} alt="Logo"  className="w-auto h-16 mr-2" />
                                </figure>
                            )}
                            {key === 'colors' && settings[key] && Array.isArray(settings[key]) && settings[key].map((color: any, index: number) => (
                                <div key={index} className="w-6 h-6 mr-2" style={{ backgroundColor: color.value }}></div>
                            ))}
                            {key === 'fonts' && settings[key] && Array.isArray(settings[key]) && settings[key].map((font: any, index: number) => (
                                <span key={index} className="mr-2" style={{ fontFamily: font.value }}>{font.value}</span>
                            ))}
                            {key !== 'logoURL' && key !== 'colors' && key !== 'fonts' && settings[key].value}
                        </span>
                    </div>
                ))}
                <div className="mt-4 flex justify-end space-x-2">
                    <Button onClick={onCancel} variant={"secondary"}>Close</Button>
                </div>
            </div>
        </div>
    );
}

export default DesignSpecs;
