import React, { useState } from 'react'
import { BiChevronDown } from 'react-icons/bi'
import { IoChevronBack } from 'react-icons/io5'
import { FaVolumeDown, FaVolumeUp } from "react-icons/fa";

const NavBar = () => {
    return (
        <div className='flex justify-between items-end pt-2 pb-2' >
            <div className='flex items-center space-x-2' >
                <button className='h-7.5 w-7.5 bg-gray-100 border border-gray-200 rounded-full inline-flex items-center justify-center cursor-pointer' >
                    <IoChevronBack className='text-sm' />
                </button>
                <div className='relative'>
                    <button className='inline-flex space-x-1 items-center h-7.5 bg-gray-100 border border-gray-200 rounded-full px-3 cursor-pointer text-sm' >
                        <span>All</span>
                        <BiChevronDown className='text-[16px]' />
                    </button>
                </div>
            </div>
            <VolumeSlider width='w-18' height='h-2' />
        </div>
    )
}

export default NavBar





type VolumeSliderProps = {
    width?: string;       // e.g. "w-64"
    height?: string;      // e.g. "h-2"
    thumbSize?: number;   // px (still needs inline for pseudo)
};

const VolumeSlider = ({
    width = "w-64",
    height = "h-2",
    thumbSize = 16,
}: VolumeSliderProps) => {
    const [volume, setVolume] = useState(50);

    return (
        <div className="flex h-7.5 px-2 items-center gap-3 bg-gray-100 rounded-full border border-gray-200">
            {/* Left Icon */}
            <FaVolumeDown className="text-gray-600" size={18} />

            {/* Slider */}
            <div className={`relative ${width}`}>
                <input
                    type="range"
                    min={0}
                    max={100}
                    value={volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    className={`w-full ${height} appearance-none rounded-full bg-gray-300 cursor-pointer`}
                    style={{
                        background: `linear-gradient(to right, #22c55e ${volume}%, #d1d5db ${volume}%)`,
                    }}
                />

                {/* Thumb styling (still needs CSS) */}
                <style>
                {`
                    input[type="range"]::-webkit-slider-thumb {
                        appearance: none;
                        width: ${thumbSize}px;
                        height: ${thumbSize}px;
                        border-radius: 9999px;
                        background: #2b7fff;
                        cursor: pointer;
                        margin-top: calc(${height.replace("h-", "") * 0.25}px);
                    }

                    input[type="range"]::-moz-range-thumb {
                        width: ${thumbSize}px;
                        height: ${thumbSize}px;
                        border-radius: 9999px;
                        background: #2b7fff;
                        cursor: pointer;
                    }
                `}
                </style>
            </div>

            {/* Right Icon */}
            <FaVolumeUp className="text-gray-600" size={18} />
        </div>
    );
};

