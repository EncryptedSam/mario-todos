import React, { useEffect, useRef, useState } from 'react'
import ButtonGroup from './shared/ButtonGroup';
import { MdDeleteOutline, MdOutlineEdit, MdOutlineEditOff } from 'react-icons/md';

interface TodoGroupProps {
    type?: 'progress' | 'step';
    readOnly?: boolean;
    percentage?: number;
    onDelete?(): void;
    value: string;
    onChange?(value: string): void;
    onClick?(): void;
    taskCount?: number
}

const DEBOUNCE_DELAY = 400;

const TodoGroupCard = ({ percentage, readOnly, value, onChange, onDelete, onClick, taskCount }: TodoGroupProps) => {
    const [text, setText] = useState(value);
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [isEdit, setIsEdit] = useState<boolean>(false);


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

    const handleChange = (val: string) => {
        setText(val);
        autoResize();

        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        debounceRef.current = setTimeout(() => {
            onChange?.(val);
        }, DEBOUNCE_DELAY);
    };

    const handleClick = () => {
        if (isEdit) return;
        onClick?.();
    }

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
        const handleClickOutside = (e: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(e.target as Node)
            ) {
                setIsEdit(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);


    let buttonGroupButtons = [
        {
            icon: <MdOutlineEdit className='text-gray-700' />,
            onClick: () => { setIsEdit(true) }
        },
        {
            icon: <MdDeleteOutline className='text-red-500' />,
            onClick: onDelete
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
                onClick: onDelete
            }
        ]
    }

    const dots = Array.from({ length: taskCount ?? 0 }, (_, i) => i);

    return (
        <div
            ref={containerRef}
            className={`
                relative p-3 group rounded-2xl bg-gray-100 text-sm flex flex-col space-x-3! space-y-2! border border-gray-200 
                ${!isEdit && !readOnly && 'cursor-pointer'}
            `}
            onClick={handleClick}
        >

            {!readOnly && (
                <ButtonGroup
                    buttons={buttonGroupButtons}
                    top={-10}
                    right={0}
                    alwaysVisible={isEdit}
                />
            )}

            <div className='flex w-full text-sm font-medium'>
                <textarea
                    ref={textareaRef}
                    className={`flex-1 resize-none overflow-hidden bg-transparent outline-none ${!isEdit && 'cursor-pointer pointer-events-none'}`}
                    value={text}
                    onChange={(e) => handleChange(e.target.value)}
                    rows={1}
                    placeholder="Untitled"
                    disabled={!isEdit}
                />
                <span className='inline-flex shrink-0 items-end w-10 justify-end'>
                    {percentage?.toFixed(0) ?? 0}%
                </span>
            </div>

            <div className="relative w-full h-2 bg-gray-300 rounded overflow-hidden">
                <div
                    className="h-full bg-blue-500 transition-all duration-300 rounded-full"
                    style={{ width: `${percentage ?? 30}%` }}
                />
                <div className='absolute top-0 left-0 flex w-full h-full items-center justify-between' >
                    {
                        dots.map(() => {
                            return (
                                <span className='w-1.5 h-1.5 bg-gray-100 rounded-full first-of-type:opacity-0 last-of-type:opacity-0' />
                            )
                        })
                    }
                </div>
            </div>
        </div>
    );
};

export default TodoGroupCard;