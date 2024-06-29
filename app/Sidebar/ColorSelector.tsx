'use client';

interface Color {
    hex: string;
}

interface ColorSelectorProps {
    colors: Color[];
    setColors: (colors: Color[]) => void;
}

const ColorSelector: React.FC<ColorSelectorProps> = ({
    colors,
    setColors,
}:{
    colors: Color[],
    setColors: (colors: Color[]) => void
}) => {

    const addColor = () => {
        setColors([...colors, { hex: '' }]);
    };

    const removeColor = (index: number) => {
        setColors(colors.filter((_, i) => i !== index));
    };

    const handleColorChange = (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
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
                    />
                    <input
                        type="text"
                        value={color.hex}
                        onChange={handleColorChange(index)}
                        style={{ width: '80px', marginRight: '10px' , border: '1px solid #000', backgroundColor: "#fff"}}
                    />
                    <button onClick={() => removeColor(index)} style={{ marginLeft: '10px' }}>
                        -
                    </button>
                </div>
            ))}
            <button onClick={addColor} style={{ display: 'block', marginTop: '10px' }}>
                + Add Color
            </button>
        </div>
    );
};

export default ColorSelector;
