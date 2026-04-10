import React, { useEffect, useRef, useState, forwardRef } from 'react'
import coinSound from "../assets/sounds/mario_coin_sound.mp3";
import ButtonGroup, { type Props as ButtonGroupProps } from './shared/ButtonGroup';
import { MdCheck, MdClose, MdDeleteOutline, MdOutlineEdit, MdOutlineEditOff } from 'react-icons/md';
import useEscape from '../hooks/useEscape';
import { BsThreeDotsVertical } from 'react-icons/bs';

interface Props {
    value: string
    onChangeText?(value: string): void;

    checked?: boolean
    onClickCheck?(value: boolean): void

    onDelete?(): void;
    volume?: number

    onHitEnter?(): void;
    focus?: boolean;

    // 👇 drag events
    onDragStart?(e: React.DragEvent<HTMLDivElement>): void;
    onDragOver?(e: React.DragEvent<HTMLDivElement>): void;
    onDrop?(e: React.DragEvent<HTMLDivElement>): void;
    onDragEnter?(e: React.DragEvent<HTMLDivElement>): void;
    onDragLeave?(e: React.DragEvent<HTMLDivElement>): void;
    onDragEnd?(e: React.DragEvent<HTMLDivElement>): void;
    hide?: boolean;
}

const DEBOUNCE_DELAY = 400;

const TodoItemCard = forwardRef<HTMLDivElement, Props>(({
    value,
    onChangeText,
    checked = false,
    onClickCheck,
    onDelete,
    volume,
    onHitEnter,
    focus,
    onDragStart,
    onDragOver,
    onDrop,
    onDragEnter,
    onDragLeave,
    onDragEnd,
    hide
}: Props, ref) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [text, setText] = useState(value);
    const [isChecked, setIsChecked] = useState<boolean>(checked);
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const debounceRef = useRef<number | null>(null);
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);


    useEscape(() => {
        setIsEdit(false);
        setIsDeleteConfirmOpen(false);
    });

    const autoResize = () => {
        const el = textareaRef.current;
        if (!el) return;

        el.style.height = "auto";
        el.style.height = el.scrollHeight + "px";
    };

    useEffect(() => {
        setText(value);
        autoResize();
    }, [value]);

    useEffect(() => {
        if (isEdit && textareaRef.current) {
            const el = textareaRef.current;

            el.focus();

            // move cursor to end
            const length = el.value.length;
            el.setSelectionRange(length, length);

            autoResize();
        }
    }, [isEdit]);


    useEffect(() => {
        if (focus && textareaRef.current) {
            setIsEdit(true);
        }
    }, [focus]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(e.target as Node)
            ) {
                setIsEdit(false);
                setIsDeleteConfirmOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleTextareaChange = (val: string) => {
        setText(val);
        autoResize();

        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        debounceRef.current = window.setTimeout(() => {
            onChangeText?.(val);
        }, DEBOUNCE_DELAY);
    };

    const handleCheck = () => {
        const checked = !isChecked;

        setIsChecked(checked)
        if (checked) {
            const audio = new Audio(coinSound);
            audio.volume = volume ?? 0.3;
            audio.play();
        }
        onClickCheck?.(checked);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onHitEnter?.();
            setIsEdit(false);
        }
    };

    let buttonGroupButtons: ButtonGroupProps['buttons'] = [
        {
            icon: <MdOutlineEdit className='text-gray-700' />,
            onClick: () => { setIsEdit(true) }
        },
        {
            icon: <MdDeleteOutline className='text-red-500' />,
            onClick: () => { setIsDeleteConfirmOpen(true) }
        }
    ]

    if (isEdit) {
        buttonGroupButtons = [
            {
                icon: <MdOutlineEditOff className='text-gray-700' />,
                onClick: () => { setIsEdit(false) }
            },
            {
                icon: <MdDeleteOutline className='text-red-500' />,
                onClick: () => { setIsDeleteConfirmOpen(true) }
            }
        ]
    }

    if (isDeleteConfirmOpen) {
        buttonGroupButtons = [
            {
                text: 'Are you sure want to delete?',
            },
            {
                icon: <MdCheck className='text-red-500 ' />,
                onClick: () => { onDelete?.() }
            },
            {
                icon: <MdClose className='text-gray-700' />,
                onClick: () => { setIsDeleteConfirmOpen(false) }
            }
        ]
    }

    return (
        <div
            ref={(el) => {
                containerRef.current = el;

                if (typeof ref === "function") {
                    ref(el);
                } else if (ref) {
                    (ref as React.RefObject<HTMLDivElement | null>).current = el;
                }
            }}

            className={`
                relative p-3 group rounded-2xl bg-gray-100 text-sm flex space-x-3! border border-gray-200
                ${isEdit ? 'border-gray-400' : ''}
                `
            }
            style={{ opacity: hide ? 0 : 1 }}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDrop={onDrop}
            onDragEnter={onDragEnter}
            onDragLeave={onDragLeave}
            onDragEnd={onDragEnd}
            draggable={!isEdit}

        >

            {isChecked ? (
                <div
                    className='shrink-0 w-5 h-5 bg-no-repeat bg-cover bg-center cursor-pointer mario-hit'
                    onClick={handleCheck}
                    style={{
                        backgroundImage: "url('/coin.gif')",
                        backgroundSize: '30px'
                    }}
                />
            ) : (
                <div
                    className='shrink-0 w-5 h-5 border border-gray-400 rounded-full cursor-pointer'
                    onClick={handleCheck}
                />
            )}

            <div className='relative flex-1' >
                <textarea
                    ref={textareaRef}
                    className={`
                    w-full resize-none overflow-hidden bg-transparent outline-none 
                    ${isEdit ? '' : 'cursor-pointer select-text'}
                    `
                    }
                    onChange={(e) => handleTextareaChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    rows={1}
                    placeholder="Untitled"
                    value={text}
                    readOnly={!isEdit}
                />
                {!isEdit &&
                    <div
                        className='absolute top-0 left-0 w-full h-full cursor-pointer'
                        onDoubleClick={(e) => {
                            setIsEdit(true);
                        }}
                    />
                }
            </div>

            <SideDropMenu />
        </div>
    );
});

export default TodoItemCard;


const SideDropMenu = () => {
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
        >
            <button
                className='inline-flex text-gray-400 hover:text-gray-600 text-sm items-center justify-center shrink-0 grow-0 w-5 h-5 cursor-pointer'
                onClick={() => { setShowMenu(!showMenu) }}
            >
                <BsThreeDotsVertical />
            </button>

            {showMenu &&

                <div
                    className='absolute flex flex-col text-sm py-3 min-w-30 right-[calc(100%+4px)] top-0 rounded-xl border border-gray-200 bg-gray-100 z-10 shadow-md'
                >
                    <button
                        onClick={() => { }}
                        className={`px-3 py-0.5 inline-flex items-center space-x-2 text-left hover:bg-gray-200 cursor-pointer`
                        }
                    >
                        <MdOutlineEdit className='text-gray-700' />
                        <span>Edit</span>
                    </button>
                    <button
                        onClick={() => { }}
                        className={`px-3 py-0.5 inline-flex items-center space-x-2 text-left hover:bg-gray-200 cursor-pointer`
                        }
                    >
                        <MdDeleteOutline className='text-red-500' />
                        <span>Delete</span>
                    </button>
                </div>
            }
        </div>
    )
}
