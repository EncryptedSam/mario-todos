import React, { useEffect, useRef, useState } from 'react'
import { BiChevronDown } from 'react-icons/bi';

export interface Props {
    onChange?(value: string): void;
    options?: { lable?: string, value: string }[]
    value: string
}

const DropDown = ({ onChange, options = [], value }: Props) => {
    const [open, setOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    const selected = options.find(opt => opt.value === value)

    const handleSelect = (val: string) => {
        onChange?.(val)
        setOpen(false)
    }

    // close on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <div className='relative' ref={ref}>
            <button
                onClick={() => setOpen(prev => !prev)}
                className='inline-flex space-x-1 items-center h-7.5 bg-gray-100 border border-gray-200 rounded-full px-3 cursor-pointer text-sm'
            >
                <span>{selected?.lable ?? selected?.value ?? 'Select'}</span>
                <BiChevronDown className='text-[16px]' />
            </button>

            {open && (
                <div className='absolute flex flex-col text-sm py-3 min-w-30 top-[calc(100%+4px)] rounded-xl border border-gray-200 bg-gray-100 z-1 shadow-md'>
                    {options.map((opt) => {
                        const isActive = opt.value === value
                        return (
                            <button
                                key={opt.value}
                                onClick={() => handleSelect(opt.value)}
                                className={`
                                    px-3 text-left py-0.5 hover:bg-gray-200 cursor-pointer
                                    ${isActive ? 'text-gray-100 bg-blue-500!' : ''}`
                                }
                            >
                                {opt.lable ?? opt.value}
                            </button>
                        )
                    })}
                </div>
            )}
        </div>
    )
}


export default DropDown