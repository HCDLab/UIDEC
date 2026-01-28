import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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
            <div className="bg-white p-6 rounded-lg shadow-lg z-10 w-full max-w-[600px]">
                <h2 className="text-3xl font-bold">Design Specs</h2>
                {settings && Object.keys(settings).map((key) => (
                    <div key={key} className="flex justify-between items-center mt-2">
                        <span className="text-2xl">{formatKey(key)}</span>
                        <span className="text-2xl flex items-center">
                            {key === 'industry' && settings[key].value && (
                                <span className="mr-2">{settings[key].value.split('-')[1]}</span>
                            )}
                            {key === 'screen_type' && settings[key].value && (
                                <span className="mr-2">{settings[key].value.split('-')[1]}</span>
                            )}
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
                            {key !== 'logoURL' && key !== 'colors' && key !== 'fonts' && key !== 'industry' && key !=='screen_type' && settings[key].value}
                        </span>
                    </div>
                ))}
                <div className="mt-4 flex justify-end space-x-2">
                    <Button onClick={onCancel} variant={"secondary"} size={"lg"} className="text-2xl">Close</Button>
                    <Button onClick={()=>{
                        const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' })
                        const url = URL.createObjectURL(blob)
                        const a = document.createElement('a')
                        a.href = url
                        a.download = 'settings.json'
                        a.click()
                        URL.revokeObjectURL(url)
                        toast('Settings exported successfully', {
                            duration: 3000,
                        })
                    }} variant={"default"} size={"lg"} className="text-2xl">Download Settings</Button>
                </div>
            </div>
        </div>
    );
}

export default DesignSpecs;
