import React from 'react'
import { AiOutlineContainer } from 'react-icons/ai'
import { MdOutlineAddTask } from 'react-icons/md'

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
                        <span>Add New Group</span>
                        <AiOutlineContainer className='text-[16px]' />
                    </>
                }
                {type == 'task' &&
                    <>
                        <span>Add New Task</span>
                        <MdOutlineAddTask className='text-[16px]' />
                    </>
                }
            </button>
        </div>
    )
}

export default AddNewButton