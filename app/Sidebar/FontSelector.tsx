'use client';

import 'react-fontpicker-ts/dist/index.css'

import FontPicker from 'react-fontpicker-ts'

interface FontSelectorProps {
    fonts: string[];
    setFonts: (fonts: string[]) => void;
    disabled?: boolean; 
}

const FontSelector: React.FC<FontSelectorProps> = ({
    fonts,
    setFonts,
    disabled = false,
}) => {

    const addFont = () => {
        if (disabled) return; 
        setFonts([...fonts, '']);
    };

    const removeFont = (index: number) => {
        if (disabled) return; 
        setFonts(fonts.filter((_, i) => i !== index));
    };

    const handleFontChange = (index: number) => (font: string) => {
        if (disabled) return; 
        const newFonts = [...fonts];
        newFonts[index] = font;
        setFonts(newFonts);
        console.log(newFonts);
    };

    return (
        <div>
            {fonts.map((font, index) => (
                <div key={index} style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                    <div style={{ position: 'relative', width: '200px' }}>
                        {/* Render FontPicker if not disabled */}
                        {!disabled ? (
                            <FontPicker
                                style={{ width: '200px' }}
                                defaultValue={font}
                                value={handleFontChange(index)}
                            />
                        ) : (
                            <div
                                style={{
                                    width: '200px',
                                    height: '30px', 
                                    backgroundColor: '#f0f0f0',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#a0a0a0',
                                    border: '1px solid #ddd',
                                }}
                            >
                                Font Picker Disabled
                            </div>
                        )}
                        {/* Overlay to prevent interaction */}
                        {disabled && (
                            <div
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    backgroundColor: 'rgba(255, 255, 255, 0.5)', 
                                    pointerEvents: 'none', 
                                }}
                            />
                        )}
                    </div>
                    <button onClick={() => removeFont(index)} style={{ marginLeft: '10px' }} disabled={disabled}>
                        -
                    </button>
                </div>
            ))}
            <button onClick={addFont} style={{ display: 'block', marginTop: '20px' }} disabled={disabled}>
                + Add Font
            </button>
        </div>
    );
};

export default FontSelector;
