import React from 'react'
import { AiOutlineContainer } from 'react-icons/ai'
import { FaRegListAlt } from 'react-icons/fa'

interface Props {
    type?: 'task' | 'group'
    onClick?(): void
    className?: string
}

const AddNewButton = ({ type, onClick, className }: Props) => {
    return (
        <div className={`w-full py-2 ${className}`}>
            <button
                className='w-full py-2 inline-flex items-center justify-center space-x-2! text-sm font-medium bg-red-600 rounded-full text-gray-100 cursor-pointer'
                onClick={onClick}
            >
                {type == 'group' &&
                    <>
                        <span>Create New Group</span>
                        <AiOutlineContainer className='text-[16px]' />
                    </>
                }
                {type == 'task' &&
                    <>
                        <span>Create New Task</span>
                        <FaRegListAlt className='text-[16px]' />
                    </>
                }
            </button>
        </div>
    )
}

export default AddNewButton