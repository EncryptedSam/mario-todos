import React, { useState } from 'react'
import { IoChevronBack } from 'react-icons/io5'
import DropDown from './DropDown';
import VolumeSlider from './VolumeSlider';

const NavBar = () => {
    const [filter, setFilter] = useState('all')


    return (
        <div className='flex justify-between items-end pt-2 pb-2' >
            <div className='flex items-center space-x-2' >
                <button className='h-7.5 w-7.5 bg-gray-100 border border-gray-200 rounded-full inline-flex items-center justify-center cursor-pointer' >
                    <IoChevronBack className='text-sm' />
                </button>
                <DropDown
                    value={filter}
                    onChange={setFilter}
                    options={[
                        { value: 'all', lable: 'All' },
                        { value: 'completed', lable: 'Completed' },
                        { value: 'pending', lable: 'Pending' },
                    ]}
                />
            </div>
            <VolumeSlider width='w-18' height='h-2' />
        </div>
    )
}

export default NavBar
