'use client';

import 'react-fontpicker-ts/dist/index.css'

import FontPicker from 'react-fontpicker-ts'

interface FontSelectorProps {
    fonts: string[];
    setFonts: (fonts: string[]) => void;
}

const FontSelector: React.FC<FontSelectorProps> = ({
    fonts,
    setFonts,
}:{
    fonts: string[],
    setFonts: (fonts: string[]) => void
}) => {

    const addFont = () => {
        setFonts([...fonts, '']);
    };

    const removeFont = (index: number) => {
        setFonts(fonts.filter((_, i) => i !== index));
    };

    const handleFontChange = (index: number) => (font: string) => {
        const newFonts = [...fonts];
        newFonts[index] = font;
        setFonts(newFonts);
        console.log(newFonts);
    };

    return (
        <div>
            {fonts.map((font, index) => (
                <div key={index} style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                    <FontPicker
                        style={{ width: '200px' }}
                        defaultValue={font}
                        value={handleFontChange(index)}
                    />
                    <button onClick={() => removeFont(index)} style={{ marginLeft: '10px' }}>
                        -
                    </button>
                </div>
            ))}
            <button onClick={addFont} style={{ display: 'block', marginTop: '20px' }}>
                + Add Font
            </button>
        </div>
    );
};

export default FontSelector;
