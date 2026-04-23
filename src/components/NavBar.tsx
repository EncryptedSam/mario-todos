import React, { useEffect, useRef, useState } from 'react'
import { IoChevronBack } from 'react-icons/io5'
import DropDown, { type Props as DropDownProps } from './DropDown';
import VolumeSlider, { type Props as VolumeProps } from './VolumeSlider';
import { TbConfetti, TbConfettiOff } from 'react-icons/tb';
import wonSound from "../assets/sounds/mario_won_sound.mp3";

interface Props {
    volumeSlider: VolumeProps
    onClickBack?(): void;
    onClickConfetti?(): void;
    confettiValue?: boolean;
    showConfetti?: boolean;

    onVolumeChange?(): void;
    volumeValue?: number
    onChangeFilter?(value: 'all' | 'pending' | 'completed'): void;
}

const NavBar = ({ volumeSlider, onChangeFilter, onClickBack, confettiValue, onClickConfetti, showConfetti, volumeValue }: Props) => {
    const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
    // const audioRef = useRef<HTMLAudioElement | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(new Audio(wonSound));

    useEffect(() => {

        if (audioRef.current) {
            const audio = audioRef.current;

            if (showConfetti) {
                audio.currentTime = 0;
                audio.play();
            } else {
                audio.pause();
                audio.currentTime = 0;
            }
        }
    }, [showConfetti]);

    useEffect(() => {
        if (audioRef.current) {
            const audio = audioRef.current;
            let volume = 0.3
            if (typeof volumeValue == 'number') {
                volume = volumeValue;
            }
            audio.volume = volume;
        }
    }, [volumeValue]);

    return (
        <div className='flex justify-between items-end pt-2 pb-2' >
            <div className='flex items-center space-x-2' >
                {typeof onClickBack == 'function' &&
                    <button
                        className='h-7.5 w-7.5 bg-gray-100 border border-gray-200 rounded-full inline-flex items-center justify-center cursor-pointer'
                        onClick={onClickBack}
                    >
                        <IoChevronBack className='text-sm' />
                    </button>
                }
                {/* <DropDown {...filterDropDown} /> */}
                <DropDown

                    value={filter}
                    options={[
                        { value: 'all', lable: 'All' },
                        { value: 'pending', lable: 'Pending' },
                        { value: 'completed', lable: 'Completed' }
                    ]}
                    onChange={(value) => {
                        // @ts-ignore
                        setFilter(value);
                        // @ts-ignore
                        onChangeFilter?.(value);
                    }}
                />
            </div>

            <div className='flex items-center space-x-2' >
                <VolumeSlider className='w-30' {...volumeSlider} />
                {
                    showConfetti &&
                    <button
                        className='h-7.5 w-7.5 bg-gray-100 border border-gray-200 rounded-full inline-flex items-center justify-center cursor-pointer'
                        onClick={onClickConfetti}
                    >
                        {confettiValue &&
                            <TbConfetti className='text-sm' />
                        }
                        {!confettiValue &&
                            <TbConfettiOff className='text-sm' />
                        }
                    </button>
                }
            </div>
        </div>
    )
}

export default NavBar
