'use client';

interface Color {
    hex: string;
}

interface ColorSelectorProps {
    colors: Color[];
    setColors: (colors: Color[]) => void;
    disabled?: boolean; 
}

const ColorSelector: React.FC<ColorSelectorProps> = ({
    colors,
    setColors,
    disabled = false, 
}) => {

    const addColor = () => {
        if (disabled) return; 
        setColors([...colors, { hex: '' }]);
    };

    const removeColor = (index: number) => {
        if (disabled) return; 
        setColors(colors.filter((_, i) => i !== index));
    };

    const handleColorChange = (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
        if (disabled) return; 
        const newColors = [...colors];
        newColors[index] = { hex: event.target.value };
        setColors(newColors);
    };

    return (
        <div>
            {colors.map((color, index) => (
                <div key={index} style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                    <input
                        type="color"
                        value={color.hex}
                        onChange={handleColorChange(index)}
                        style={{ marginRight: '10px' }}
                        disabled={disabled} 
                    />
                    <input
                        type="text"
                        value={color.hex}
                        onChange={handleColorChange(index)}
                        style={{ width: '80px', marginRight: '10px', border: '1px solid #000', backgroundColor: "#fff" }}
                        disabled={disabled} 
                    />
                    <button onClick={() => removeColor(index)} style={{ marginLeft: '10px' }} disabled={disabled}>
                        -
                    </button>
                </div>
            ))}
            <button onClick={addColor} style={{ display: 'block', marginTop: '10px' }} disabled={disabled}>
                + Add Color
            </button>
        </div>
    );
};

export default ColorSelector;
