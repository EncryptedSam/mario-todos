import React, { useEffect, useRef, useState } from 'react'
import { BsThreeDotsVertical } from 'react-icons/bs';
import useEscape from '../../hooks/useEscape';

type Option = {
    icon?: React.ReactNode
    label: string;
    onClick?(): void;
}

interface Props {
    options?: Option[]
    alignBottm?: boolean
}

const SideDropMenu = ({ options, alignBottm }: Props) => {
    const [showMenu, setShowMenu] = useState<boolean>(false);
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEscape(() => {
        setShowMenu(false);
    });

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(e.target as Node)
            ) {
                setShowMenu(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);


    return (
        <div
            ref={containerRef}
            className='relative rounded-full cursor-pointer h-5'
            onClick={(e) => {
                e.preventDefault()
                e.stopPropagation();
            }}
        >
            <button
                className={`
                    inline-flex text-gray-400 hover:text-gray-600 text-sm items-center justify-center shrink-0 grow-0 w-5 h-5 cursor-pointer
                    ${showMenu && 'text-gray-600'}
                    `
                }
                onClick={() => { setShowMenu(!showMenu) }}
            >
                <BsThreeDotsVertical />
            </button>

            {showMenu &&
                <div
                    className={`
                        absolute flex flex-col text-sm py-2 min-w-30 right-[calc(100%+4px)] rounded-xl border border-gray-200 bg-gray-100 z-10 shadow-md ${alignBottm ? 'bottom-0' : 'top-0'}
                        `
                    }
                >
                    {
                        options?.map(({ label, icon, onClick }, idx) => {
                            return (
                                <button
                                    key={`${label}_${idx}`}
                                    className={`text-[14px] font-normal text-gray-800 px-3 inline-flex items-center space-x-2 text-left hover:bg-gray-200 cursor-pointer py-1`}
                                    onClick={() => { onClick?.(); setShowMenu(false) }}
                                >
                                    <span className='text-sm'>{icon}</span>
                                    <span>{label}</span>
                                </button>
                            )
                        })
                    }
                </div>
            }
        </div>
    )
}


export default SideDropMenu
