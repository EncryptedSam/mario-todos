import React, { useState } from 'react'
import { RiVolumeDownLine, RiVolumeUpLine } from 'react-icons/ri';

export interface Props {
    className?: string
    onChange?: (value: number) => void;
    value?: number
};

const VolumeSlider = ({ className, onChange, value }: Props) => {

    return (
        <div className={`flex h-7.5 px-2 items-center gap-2 bg-gray-100 rounded-full border border-gray-200 ${className}`}>
            <RiVolumeDownLine className="text-gray-600 shrink-0" size={18} />

            <div className={`relative`}>
                <div className={`relative flex items-center`}>
                    <div className='absolute w-full h-2 bg-gray-300 rounded-full overflow-hidden' >
                        <div
                            className='bg-blue-500 h-full'
                            style={{
                                width: `${value}%`
                            }}
                        />
                    </div>
                    <input
                        type="range"
                        min={0}
                        max={100}
                        value={value}
                        onChange={(e) => onChange && onChange(Number(e.target.value))}
                        className={`relative w-full appearance-none bg-transparent cursor-pointer z-10`}
                    />
                </div>
            </div>

            <RiVolumeUpLine className="text-gray-600 shrink-0" size={18} />
        </div>
    );
};


export default VolumeSlider