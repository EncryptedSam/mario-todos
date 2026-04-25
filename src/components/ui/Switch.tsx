import React from 'react'


interface Props {
    value: boolean;
    onClick?: (value: boolean) => void;
    disabled?: boolean;
    className?: string;
}

const Switch: React.FC<Props> = ({ value, onClick, disabled, className }) => {
    const handleToggle = () => {
        if (disabled) return;
        onClick?.(!value);
    };

    return (
        <div
            onClick={handleToggle}
            className={`
                w-8 h-4 flex items-center rounded-full p-0.5 cursor-pointer
                transition-all duration-300
                ${value ? "bg-red-500" : "bg-gray-300"}
                ${disabled ? "opacity-50 cursor-not-allowed" : ""}
                ${className}
            `}
        >
            <div
                className={`
                    w-3 h-3 bg-yellow-500 rounded-full shadow-md
                    transform transition-all duration-300
                    ${value ? "translate-x-4" : "translate-x-0"}
                `}
            />
        </div>
    );
};

export default Switch;