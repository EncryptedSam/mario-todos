import React, { useEffect, useRef, useState } from 'react'
import { RiVolumeDownLine, RiVolumeMuteLine, RiVolumeUpLine } from 'react-icons/ri';

export interface Props {
    className?: string
    onChange?: (value: number) => void;
    value?: number
};

const VolumeSlider = ({ className, onChange, value }: Props) => {
    const [sliderWidth, setSliderWidth] = useState<number>(0);
    const sliderRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (sliderRef.current) {
            setSliderWidth(sliderRef.current.offsetWidth);
        }
    }, []);


    let left = 0;
    if (typeof value == 'number') {
        left = (value / 100) * (100 - ((15 / sliderWidth) * 100));
    }

    return (
        <div className={`flex h-7.5 px-2 items-center gap-2 bg-gray-100 rounded-full border border-gray-200 ${className}`}>
            {value == 0 ?
                <RiVolumeMuteLine className="text-gray-600 shrink-0" size={18} />
                :
                <RiVolumeDownLine className="text-gray-600 shrink-0 -ml-0.5" size={18} />
            }
            <div className={`relative`}>
                <div
                    ref={sliderRef}
                    className={`relative flex items-center`}
                >
                    <div className='absolute w-full h-2 bg-gray-300 rounded-full overflow-hidden'>

                        <div
                            className='bg-red-500 h-full'
                            style={{
                                width: `${value}%`
                            }}
                        />
                    </div>
                    <div
                        className='absolute bg-yellow-500 w-4 h-4 rounded-full pointer-events-none'
                        style={{ left: `${left}%` }}
                    />
                    <input
                        type="range"
                        min={0}
                        max={100}
                        value={value}
                        onChange={(e) => onChange && onChange(Number(e.target.value))}
                        className={`relative w-full appearance-none bg-transparent cursor-pointer opacity-0 z-10`}
                    />
                </div>
            </div>

            <RiVolumeUpLine className="text-gray-600 shrink-0" size={18} />
        </div>
    );
};


export default VolumeSlider