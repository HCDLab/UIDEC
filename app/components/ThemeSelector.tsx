import { DESIGN_SYSTEM_TOKENS } from "../prompt";
import { useState } from 'react';

const ColorSwatch = ({ color }: { color: string }) => {
    return (
        <div
            className="w-[25px] h-[25px]"
            style={{ backgroundColor: color }}
        />
    );
};

const ColorSwatchList = ({ colors }: { colors: string[] }) => {
    return (
        <div className="flex justify-between w-full mt-2 rounded">
            {colors.map((color, index) => (
                <ColorSwatch key={index} color={color} />
            ))}
        </div>
    );
};

function ThemeCard({
    title,
    description,
    colors,
    isSelected,
    onSelect
}: {
    title: string,
    description: string,
    colors: string[],
    isSelected: boolean,
    onSelect: () => void
}) {
    return (
        <label
            className={`flex flex-col items-center p-2 rounded-lg w-full cursor-pointer transition-colors duration-200 
                        ${isSelected ? 'bg-blue-100' : 'bg-[#F3F3F3]'}
                        hover:bg-blue-50`}
        >
            <input
                type="radio"
                name="theme"
                checked={isSelected}
                onChange={onSelect}
                className="sr-only" // Hide the default radio button
            />
            <h3 className="text-xs font-bold leading-none text-neutral-700">{title}</h3>
            <p className="mt-1.5 text-xs leading-tight text-neutral-900">{description}</p>
            <ColorSwatchList colors={colors} />
        </label>
    );
}


function ThemeSelector({theme,  setTheme }: { theme:any ,setTheme: (value: any) => void }) {
    const [selectedTheme, setSelectedTheme] = useState<string | null>(theme);
    return (
        <div className="flex flex-col">
            <div className="grid grid-cols-2 gap-4">
                {DESIGN_SYSTEM_TOKENS.map((theme, index) => (
                    <ThemeCard
                        key={index}
                        title={theme.Name}
                        description={theme.Description}
                        colors={theme.Colors}
                        isSelected={selectedTheme === theme.Name}
                        onSelect={() => {
                            setSelectedTheme(theme.Name);
                            setTheme(theme.Name);
                        }}
                    />
                ))}
            </div>
        </div>
    );
}

export default ThemeSelector;
