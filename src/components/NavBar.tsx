import { useEffect, useRef, useState } from 'react'
import { IoChevronBack } from 'react-icons/io5'
import DropDown from './DropDown';
import VolumeSlider from './VolumeSlider';
import { TbConfetti, TbKeyboard, TbSettings } from 'react-icons/tb';
import useEscape from '../hooks/useEscape';
import Switch from './ui/Switch';

interface Props {
    onClickBack?(): void;
    onClickConfetti?(): void;
    confettiValue?: boolean;
    onClickHotKeys?: () => void;

    volumeValue: number;
    onChangeVolume?(value: number): void;

    onVolumeChange?(): void;
    onChangeFilter?(value: 'all' | 'pending' | 'completed'): void;
}

const NavBar = ({ onChangeFilter, onClickBack, confettiValue, onClickConfetti, onClickHotKeys, onChangeVolume, volumeValue }: Props) => {
    const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');



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
                <VolumeSlider
                    className='w-30'
                    value={volumeValue}
                    onChange={onChangeVolume}
                />
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

