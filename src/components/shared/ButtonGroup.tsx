import React from 'react'

export interface Props {
    buttons?: { text?: string, icon?: React.ReactNode, onClick?(): void }[]
    right?: number;
    top?: number;
    alwaysVisible?: boolean;
    selected?: boolean;
}

const ButtonGroup = ({ right, top, buttons, alwaysVisible = false, selected }: Props) => {
    return (
        <div
            className={`
                absolute border border-gray-200 bg-gray-100 rounded-xl overflow-hidden z-10
                ${alwaysVisible ? 'flex' : 'hidden group-hover:flex'}
                ${selected ? 'border-red-200 bg-red-100' : ''}
            `}
            style={{ right, top }}
            onClick={(e) => e.stopPropagation()}
        >
            {
                buttons?.map(({ text, icon, onClick }, idx) => {
                    return (
                        <button
                            key={`${idx}`}
                            className={`
                                inline-flex relative items-center justify-center h-5 w-8 border-0 border-r border-gray-200 last-of-type:border-0 cursor-pointer group/item ${text ? 'w-auto px-2 space-x-2' : ''}
                                `
                            }
                            onClick={(e) => {
                                e.stopPropagation();
                                onClick?.();
                            }}
                        >
                            {
                                !text &&
                                <div
                                    className={
                                        `
                                    hidden border-2 rounded-full border-transparent w-[calc(100%-2px)] h-[calc(100%-2px)] absolute bg-gray-200 z-0 group-hover/item:inline-block ${selected ? 'bg-red-200' : ''}
                                    `
                                    }
                                />
                            }

                            {text &&
                                <span className='text-sm z-10' >{text}</span>
                            }
                            <span className='z-10'>
                                {icon}
                            </span>
                        </button>
                    )
                })
            }
        </div>
    )
}


export default ButtonGroup