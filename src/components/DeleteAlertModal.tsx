import React from 'react'
import { BsExclamationCircle } from 'react-icons/bs'

interface Props {
    placeholder?: string;
    onDelete?(): void;
    onCancel?(): void;
}


const DeleteAlertModal = ({ placeholder, onCancel, onDelete }: Props) => {
    return (
        <div
            className='absolute flex items-center justify-center top-0 left-0 z-1 w-full h-full'
        >
            <div className='absolute bg-gray-950 opacity-50 top-0 left-0 z-0 w-full h-full' />
            <div className='relative p-5 px-8 pb-4 pt-6  text-sm  bg-gray-100 rounded-2xl border border-gray-200' >
                <span className='flex w-8 h-8 rounded-full mx-auto bg-red-200 items-center justify-center mb-1' >
                    <BsExclamationCircle className='text-red-500' />
                </span>
                <div className='mb-5' >
                    <h1 className='font-medium text-gray-900 text-center text-lg'>Delete Item</h1>
                    <p className='text-xs text-gray-800 text-center'>Are you sure want to delete this Item?</p>
                    <p className='text-xs text-gray-800 text-center'>This action cannot be undone.</p>
                </div>
                <div className='flex space-x-2' >
                    <button
                        className='flex-1  text-gray-900 bg-gray-200 rounded-full py-2 cursor-pointer'
                        onClick={onCancel}
                    >Cancel</button>
                    <button
                        className='flex-1  text-gray-50 rounded-full bg-red-500  py-2 cursor-pointer'
                        onClick={onDelete}
                    >Delete</button>
                </div>
            </div>
        </div>
    )
}

export default DeleteAlertModal