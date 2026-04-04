import React, { useState } from 'react'
import { FaVolumeDown, FaVolumeUp } from 'react-icons/fa';

type Props = {
    width?: string;
    height?: string;
    thumbSize?: number;
};

const VolumeSlider = ({
    width = "w-64",
    height = "h-2",
    thumbSize = 16,
}: Props) => {
    const [volume, setVolume] = useState(50);

    return (
        <div className="flex h-7.5 px-2 items-center gap-3 bg-gray-100 rounded-full border border-gray-200">
            <FaVolumeDown className="text-gray-600" size={18} />

            <div className={`relative ${width}`}>
                <div className={`relative flex items-center ${width}`}>
                    <div className='absolute w-full h-2 bg-gray-300 rounded-full overflow-hidden' >
                        <div
                            className='bg-blue-500 h-full'
                            style={{
                                width: `${volume}%`
                            }}
                        />
                    </div>
                    <input
                        type="range"
                        min={0}
                        max={100}
                        value={volume}
                        onChange={(e) => setVolume(Number(e.target.value))}
                        className={`relative w-full ${height} appearance-none bg-transparent cursor-pointer z-10`}
                    />
                </div>
            </div>

            <FaVolumeUp className="text-gray-600" size={18} />
        </div>
    );
};


export default VolumeSlider