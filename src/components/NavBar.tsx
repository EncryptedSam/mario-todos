import React, { useEffect, useRef, useState } from 'react'
import { IoChevronBack } from 'react-icons/io5'
import DropDown from './DropDown';
import VolumeSlider, { type Props as VolumeProps } from './VolumeSlider';
import { TbConfetti, TbKeyboard, TbSettings } from 'react-icons/tb';
import wonSound from "../assets/sounds/mario_won_sound.mp3";
import useEscape from '../hooks/useEscape';
import Switch from './ui/Switch';

interface Props {
    volumeSlider: VolumeProps
    onClickBack?(): void;
    onClickConfetti?(): void;
    confettiValue?: boolean;
    showConfetti?: boolean;
    onClickHotKeys?: () => void;

    onVolumeChange?(): void;
    volumeValue?: number
    onChangeFilter?(value: 'all' | 'pending' | 'completed'): void;
}

const NavBar = ({ volumeSlider, onChangeFilter, onClickBack, confettiValue, onClickConfetti, showConfetti, volumeValue, onClickHotKeys }: Props) => {
    const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [canPlayAudio, setCanPlayAudio] = useState(false);

    useEffect(() => {
        audioRef.current = new Audio(wonSound);
    }, []);


    useEffect(() => {
        const unlock = () => {
            const audio = audioRef.current;
            if (audio) {
                audio.play()
                    .then(() => {
                        audio.pause();
                        audio.currentTime = 0;
                        setCanPlayAudio(true);
                    })
                    .catch(() => { });
            }

            window.removeEventListener("click", unlock);
        };

        window.addEventListener("click", unlock);

        return () => window.removeEventListener("click", unlock);
    }, []);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        if (showConfetti && canPlayAudio) {
            audio.currentTime = 0;
            audio.play().catch(() => { });
        } else {
            audio.pause();
            audio.currentTime = 0;
        }

        return () => {
            const audio = audioRef.current;
            if (!audio) return;
            audio.pause();
            audio.currentTime = 0;
        }

    }, [showConfetti, canPlayAudio]);

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
                <DropDownSettings
                    confettiValue={confettiValue}
                    onClickConfetti={onClickConfetti}
                    onClickHotkeys={onClickHotKeys}
                />
            </div>
        </div>
    )
}

export default NavBar

interface DropDownSettingsProps {
    confettiValue?: boolean;
    onClickConfetti?: () => void;
    onClickHotkeys?: () => void;
}

const DropDownSettings = ({ confettiValue, onClickConfetti, onClickHotkeys }: DropDownSettingsProps) => {
    const [showOptions, setShowOptions] = useState<boolean>(false);
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEscape(() => {
        setShowOptions(false);
    });

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(e.target as Node)
            ) {
                setShowOptions(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);


    return (
        <div className='relative' ref={containerRef} >
            <button
                className={`
                    h-7.5 w-7.5 bg-gray-100 border border-gray-200 text-gray-950 rounded-full inline-flex items-center justify-center cursor-pointer

                    ${showOptions ? 'shadow-md' : ''}
                    `
                }
                onClick={() => { setShowOptions(!showOptions) }}
            >
                <TbSettings className='text-[16px]' />
            </button>
            {showOptions &&
                <div
                    className={`
                        absolute flex flex-col text-sm py-2 min-w-30 rounded-xl border border-gray-200 bg-gray-100 z-1 shadow-md top-[calc(100%+8px)] right-0 w-40
                        `
                    }
                >
                    <button
                        className={`font-normal text-gray-800 px-3 inline-flex items-center space-x-2 text-left cursor-pointer py-1 text-[14px] hover:bg-gray-200`}
                        onClick={onClickConfetti}
                    >
                        <TbConfetti className='text-[16px]' />
                        <span>Confetti</span>

                        <Switch className='ml-auto' value={confettiValue ?? false} />
                    </button>
                    <button
                        className={`font-normal text-gray-800 px-3 inline-flex items-center space-x-2 text-left hover:bg-gray-200 cursor-pointer py-1 text-[14px]`}
                        onClick={() => { setShowOptions(false); onClickHotkeys?.() }}
                    >
                        <TbKeyboard className='text-[16px]' />
                        <span>Hotkeys</span>
                    </button>
                </div>
            }
        </div>
    )
}

