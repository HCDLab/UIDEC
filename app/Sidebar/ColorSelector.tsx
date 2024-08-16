'use client';

import { Minus, PlusIcon } from "lucide-react";

import React from 'react';
import { toast } from "sonner";

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
    const maxColors = 5;

    const addColor = () => {
        if (disabled) return;
        if (colors.length >= maxColors) {
            toast(
                <div className='text-center font-semibold text-red-700'>
                    You can only select up to {maxColors} colors.
                </div>,
                { duration: 3000 }
            );
            return;
        }
        setColors([...colors, { hex: '#000000' }]);
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
        <section className="flex flex-col items-start">
            {colors.map((color, index) => (
                <div key={index} className="flex gap-1.5 items-center mt-1.5 max-w-full whitespace-nowrap w-full">
                    <div className="flex gap-2 items-start self-stretch py-2 pr-3.5 pl-2.5 my-auto rounded-lg border border-solid border-neutral-200 w-full">
                        <input
                            type="color"
                            value={color.hex}
                            onChange={handleColorChange(index)}
                            className="w-7 h-7"
                            disabled={disabled}
                        />
                        <input
                            type="text"
                            value={color.hex}
                            onChange={handleColorChange(index)}
                            className="w-full h-7 bg-transparent border-none text-neutral-900 text-base capitalize font-medium"
                            disabled={disabled}
                        />
                    </div>
                    <button onClick={() => removeColor(index)} disabled={disabled}>
                        <Minus className="h-4 w-4" />
                    </button>
                </div>
            ))}
            <button onClick={addColor} style={{ display: 'flex', marginTop: '10px', alignItems: 'center' }} disabled={disabled} className='text-sm'>
                <PlusIcon className="mr-2 h-4 w-4" />  Add Color
            </button>
        </section>
    );
};

export default ColorSelector;
