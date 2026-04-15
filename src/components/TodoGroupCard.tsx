import React, { useEffect, useRef, useState } from 'react'
import SideDropMenu from './shared/SideDropMenu';
import { MdDeleteOutline, MdOutlineEdit } from 'react-icons/md';

interface Props {
    type?: 'progress' | 'step';
    onDelete?(): void;
    value: string;
    onChange?(value: string): void;
    onClick?(): void;

    readonly?: boolean;
    total: number;
    completed: number;
    alignBottm?: boolean;
    // drag events
    onDragStart?(e: React.DragEvent<HTMLDivElement>): void;
    onDragOver?(e: React.DragEvent<HTMLDivElement>): void;
    onDrop?(e: React.DragEvent<HTMLDivElement>): void;
    onDragEnter?(e: React.DragEvent<HTMLDivElement>): void;
    onDragLeave?(e: React.DragEvent<HTMLDivElement>): void;
    onDragEnd?(e: React.DragEvent<HTMLDivElement>): void;
}

const DEBOUNCE_DELAY = 400;

const TodoGroupCard = ({
    readonly,
    value,
    onChange,
    onDelete,
    onClick,
    alignBottm,
    total,
    completed,
    onDragStart,
    onDragOver,
    onDrop,
    onDragEnter,
    onDragLeave,
    onDragEnd,

}: Props) => {
    const [text, setText] = useState(value);
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const timeoutRef = useRef<number | undefined>(undefined);
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

        clearTimeout(timeoutRef.current);

        timeoutRef.current = setTimeout(() => {
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


    let percentage: number = ((completed / total) * 100);

    percentage = isNaN(percentage) ? 0 : percentage;

    const dots = Array.from({ length: total ?? 0 }, (_, i) => i);

    return (
        <div
            ref={containerRef}
            className={`
                relative p-3 group rounded-2xl bg-gray-100 text-sm flex flex-col space-x-3! space-y-2! border border-gray-200 
                ${!isEdit && !readonly && 'cursor-pointer'}
            `}
            onClick={handleClick}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDrop={onDrop}
            onDragEnter={onDragEnter}
            onDragLeave={onDragLeave}
            onDragEnd={onDragEnd}
        >

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
                {!readonly &&
                    <SideDropMenu
                        alignBottm={alignBottm}
                        options={[
                            {
                                icon: <MdOutlineEdit className='text-gray-700' />,
                                label: 'Edit',
                                onClick: () => { setIsEdit(true) }
                            },
                            {
                                icon: <MdDeleteOutline className='text-red-500' />,
                                label: 'Delete',
                                onClick: () => { onDelete?.() }
                            }
                        ]}
                    />
                }
                {readonly &&
                    <span className='inline-flex shrink-0 items-end w-10 justify-end'>
                        {percentage.toFixed(0)}%
                    </span>
                }
            </div>

            <div className="relative w-full h-2 rounded-full overflow-hidden">
                {!readonly &&
                    <div className='w-full h-full bg-gray-300' >
                        <div
                            className="absolute h-full bg-red-500 transition-all duration-300 rounded-full"
                            style={{ width: `${percentage ?? 30}%` }}
                        />
                    </div>
                }
                {readonly &&
                    <div className='absolute space-x-1 top-0 left-0 flex w-full h-full items-center justify-between' >
                        {
                            dots.map((_, idx) => {
                                return (
                                    <span
                                        key={`${idx}`}
                                        className={`
                                        flex-1 w-2 h-full rounded-full
                                        ${idx < completed ? 'bg-red-500' : 'bg-gray-300 '}
                                        `
                                        }
                                    />
                                )
                            })
                        }
                    </div>
                }
            </div>
            {!readonly &&
                <div className='text-[13px] flex justify-between text-gray-700' >
                    <div>{completed}/{total} tasks completed</div>
                    <span>{percentage.toFixed(0)}%</span>
                </div>
            }
        </div>
    );
};

export default TodoGroupCard;