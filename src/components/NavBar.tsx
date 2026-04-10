import React, { useState } from 'react'
import { IoChevronBack } from 'react-icons/io5'
import DropDown, { type Props as DropDownProps } from './DropDown';
import VolumeSlider, { type Props as VolumeProps } from './VolumeSlider';
import { TbConfetti, TbConfettiOff } from 'react-icons/tb';

interface Props {
    volumeSlider: VolumeProps
    filterDropDown: DropDownProps
    onClickBack?(): void;
    onClickConfetti?(): void;
    confettiValue?: boolean;
    showConfetti?: boolean;
    
    onVolumeChange?(): void;
    volumeValue?: number
}

const NavBar = ({ volumeSlider, filterDropDown, onClickBack, confettiValue, onClickConfetti, showConfetti }: Props) => {


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
                <DropDown {...filterDropDown} />
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
