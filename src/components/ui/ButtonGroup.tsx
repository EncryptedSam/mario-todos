import React from 'react'

interface Props {
    buttons?: { icon?: React.ReactNode, onClick?(): void }[]
    right?: number;
    top?: number;
}

const ButtonGroup = ({ right, top, buttons }: Props) => {
    return (
        <div
            className='absolute hidden border border-gray-200 bg-gray-100 rounded-xl overflow-hidden group-hover:flex'
            style={{ right, top }}
        >
            {
                buttons?.map(({ icon, onClick }, idx) => {
                    return (
                        <button
                            key={`${idx}`}
                            className='inline-flex items-center justify-center h-5 w-8 border-0 border-r border-gray-200 last-of-type:border-0 cursor-pointer'
                            onClick={onClick}
                        >
                            {icon}
                        </button>
                    )
                })
            }
        </div>
    )
}


export default ButtonGroup