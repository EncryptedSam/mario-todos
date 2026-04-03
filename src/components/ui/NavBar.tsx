import React from 'react'
import { BiChevronDown } from 'react-icons/bi'
import { IoChevronBack } from 'react-icons/io5'

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
        </div>
    )
}

export default NavBar