export const importSettings = (file: File, onUpdate: (settings: any) => void) => {
    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const settings = JSON.parse(event.target?.result as string);
            onUpdate(settings);
        } catch (error) {
            console.error('Failed to parse JSON', error);
        }
    };
    reader.readAsText(file);
};
