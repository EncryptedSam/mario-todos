import React, { useState } from 'react'
import { IoChevronBack } from 'react-icons/io5'
import DropDown, { type Props as DropDownProps } from './DropDown';
import VolumeSlider, { type Props as VolumeProps } from './VolumeSlider';

interface Props {
    volumeSlider: VolumeProps
    filterDropDown: DropDownProps
    onClickBack?(): void;
}

const NavBar = ({ volumeSlider, filterDropDown, onClickBack }: Props) => {


    return (
        <div className='flex justify-between items-end pt-2 pb-2' >
            <div className='flex items-center space-x-2' >
                {onClickBack &&
                    <button
                        className='h-7.5 w-7.5 bg-gray-100 border border-gray-200 rounded-full inline-flex items-center justify-center cursor-pointer'
                        onClick={onClickBack}
                    >
                        <IoChevronBack className='text-sm' />
                    </button>
                }
                <DropDown {...filterDropDown} />
            </div>
            <VolumeSlider className='w-30' {...volumeSlider} />
        </div>
    )
}

export default NavBar
