import React from 'react'

interface Props {
    buttons?: { icon?: React.ReactNode, onClick?(): void }[]
    right?: number;
    top?: number;
    alwaysVisible?: boolean;
}

const ButtonGroup = ({ right, top, buttons, alwaysVisible = false }: Props) => {
    return (
        <div
            className={`
                absolute border border-gray-200 bg-gray-100 rounded-xl overflow-hidden z-10
                ${alwaysVisible ? 'flex' : 'hidden group-hover:flex'}
            `}
            style={{ right, top }}
            onClick={(e) => e.stopPropagation()}
        >
            {
                buttons?.map(({ icon, onClick }, idx) => {
                    return (
                        <button
                            key={`${idx}`}
                            className='inline-flex items-center justify-center h-5 w-8 border-0 border-r border-gray-200 last-of-type:border-0 cursor-pointer'
                            onClick={(e) => {
                                e.stopPropagation();
                                onClick?.();
                            }}
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