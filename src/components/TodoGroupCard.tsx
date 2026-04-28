import React, { useEffect, useRef, useState } from 'react'
import { BsTrash } from 'react-icons/bs';
import useEscape from '../hooks/useEscape';

interface Props {
    type?: 'progress' | 'step';
    onDelete?(): void;
    value: string;
    hide?: boolean;

    onChange?(value: string): void;
    onClick?(): void;

    focus?: boolean;
    onClickFocus?(): void;
    onClearFocus?(): void;

    onHitEnter?(): void;
    onCtrolEnter?(): void;
    onEmptyDelete?(): void;
    onUp?(): void;
    onDown?(): void;
    onAltUp?(): void;
    onAltDown?(): void;

    isDeleting?: boolean;
    readonly?: boolean;
    total: number;
    completed: number;

    onDragStart?(e: React.DragEvent<HTMLDivElement>): void;
    onDragOver?(e: React.DragEvent<HTMLDivElement>): void;
    onDrop?(e: React.DragEvent<HTMLDivElement>): void;
    onDragEnter?(e: React.DragEvent<HTMLDivElement>): void;
    onDragLeave?(e: React.DragEvent<HTMLDivElement>): void;
    onDragEnd?(e: React.DragEvent<HTMLDivElement>): void;
}

const DEBOUNCE_DELAY = 400;

const TodoGroupCard = ({
    type = 'progress',
    readonly,
    value,
    onChange,
    onDelete,
    onClick,
    total,
    completed,
    hide,
    onDragStart,
    onDragOver,
    onDrop,
    onDragEnter,
    onDragLeave,
    onDragEnd,
    onUp,
    onDown,
    onAltUp,
    onAltDown,
    onHitEnter,
    focus,
    isDeleting,
    onClickFocus,
    onClearFocus,
    onCtrolEnter
}: Props) => {
    const [text, setText] = useState(value);
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const timeoutRef = useRef<number | undefined>(undefined);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [readMore, setReadMore] = useState<boolean>(false);
    const backspaceCountRef = useRef(0);
    const isTextAreaSelectedRef = useRef<boolean>(false);
    const [isReadonlyDisabled, setIsReadonlyDisabled] = useState(false);

    const MAX_ROWS = -1; // -1 = infinite

    const autoResize = () => {
        const el = textareaRef.current;
        if (!el) return;

        const computed = window.getComputedStyle(el);
        let lineHeight = parseFloat(computed.lineHeight);

        if (isNaN(lineHeight)) {
            const fontSize = parseFloat(computed.fontSize);
            lineHeight = fontSize * 1.2;
        }

        el.style.height = "auto";

        if (MAX_ROWS === -1) {
            // no limit
            el.style.height = el.scrollHeight + "px";
        } else {
            const maxHeight = lineHeight * MAX_ROWS;
            el.style.height = Math.min(el.scrollHeight, maxHeight) + "px";
        }
    };

    useEscape(() => {
        if (isReadonlyDisabled) {
            setIsReadonlyDisabled(false);
            setIsEdit(false);
        }
    });

    const blurTextArea = () => {
        if (textareaRef.current) {
            const el = textareaRef.current;
            el.blur();
        }
    }

    useEffect(() => {
        setText(value);
        autoResize();
    }, [value]);


    useEffect(() => {
        setIsEdit(focus ? focus : false);
        if (!focus) {
            blurTextArea();
        }
    }, [focus]);

    useEffect(() => {
        if (isEdit && textareaRef.current) {
            const el = textareaRef.current;

            const length = el.value.length;
            if (!isTextAreaSelectedRef.current) {
                el.setSelectionRange(length, length);
            }
            el.focus();
            isTextAreaSelectedRef.current = false;

            autoResize();
        }
    }, [isEdit]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(e.target as Node)
            ) {
                if (isEdit) {
                    blurTextArea();
                    onClearFocus?.();
                }
                if (isReadonlyDisabled) {
                    setIsReadonlyDisabled(false);
                    setIsEdit(false);
                }
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isEdit]);

    const handleChange = (val: string) => {
        setText(val);
        autoResize();

        clearTimeout(timeoutRef.current);

        timeoutRef.current = setTimeout(() => {
            onChange?.(val);
        }, DEBOUNCE_DELAY);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        const el = textareaRef.current;
        if (!el) return;

        const cursorStart = el.selectionStart;
        const cursorEnd = el.selectionEnd;
        const length = el.value.length;

        if (e.key === "Enter" && e.ctrlKey) {
            e.preventDefault();
            onCtrolEnter?.();
            return;
        }

        if (e.key === "ArrowUp" && e.altKey) {
            e.preventDefault();
            onAltUp?.();
            return;
        }

        if (e.key === "ArrowDown" && e.altKey) {
            e.preventDefault();
            onAltDown?.();
            return;
        }

        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onHitEnter?.();
            setIsEdit(false);
            return;
        }


        if (e.key === "Backspace") {
            if (text === "") {
                backspaceCountRef.current += 1;

                if (backspaceCountRef.current >= 2) {
                    e.preventDefault();
                    onDelete?.();

                    backspaceCountRef.current = 0;
                }
            } else {
                backspaceCountRef.current = 0;
            }
            return;
        } else {
            backspaceCountRef.current = 0;
        }

        if (e.key === "ArrowUp") {
            if (e.ctrlKey) {
                e.preventDefault();
                onUp?.();
                return;
            }

            const isAtStart = cursorStart === 0 && cursorEnd === 0;

            if (isAtStart) {
                e.preventDefault();
                onUp?.();
            }
        }

        if (e.key === "ArrowDown") {
            if (e.ctrlKey) {
                e.preventDefault();
                onDown?.();
                return;
            }

            const isAtEnd = cursorStart === length && cursorEnd === length;

            if (isAtEnd) {
                e.preventDefault();
                onDown?.();
            }
        }
    };

    const handleTextAreaClick = (e: React.MouseEvent<HTMLTextAreaElement>) => {
        e.stopPropagation();
        isTextAreaSelectedRef.current = true;
        onClickFocus?.();
    }

    const handleReadonlyDoubleClick = () => {
        onClickFocus?.();
        setIsReadonlyDisabled(true);
        setIsEdit(true);
    }


    let percentage: number = ((completed / total) * 100);

    percentage = isNaN(percentage) ? 0 : percentage;

    const dots = Array.from({ length: total ?? 0 }, (_, i) => i);

    let progressType = type;
    if (total == 0) {
        progressType = 'progress'
    }


    return (
        <div
            ref={containerRef}
            className={`
                relative rounded-2xl border cursor-grab active:cursor-grabbing
                ${hide ? 'border border-gray-400 border-dashed bg-transparent' : 'bg-gray-100 border-gray-200'}
                ${isEdit ? 'border-gray-400' : ''}
                ${isDeleting ? 'border-red-600 bg-red-100' : ''}
                `
            }
            onClick={onClick}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDrop={onDrop}
            onDragEnter={onDragEnter}
            onDragLeave={onDragLeave}
            onDragEnd={onDragEnd}
            draggable={!isEdit}
        >
            <div
                className={`
                    relative p-3 group rounded-2xl text-sm space-x-3 space-y-2  cursor-pointer
                    ${hide ? 'opacity-0' : ''}
                `}
            >

                <div className='flex w-full text-sm font-medium'>
                    {(!readonly || isReadonlyDisabled) &&
                        <textarea
                            ref={textareaRef}
                            className={`flex-1 w-full resize-none overflow-hidden bg-transparent outline-none cursor-text`}
                            value={text}
                            onChange={(e) => handleChange(e.target.value)}
                            onKeyDown={handleKeyDown}
                            rows={1}
                            onClick={handleTextAreaClick}
                            placeholder="Untitled"
                        />
                    }
                    {(readonly && !isReadonlyDisabled) &&
                        <div className={`flex-1 overflow-hidden space-y-1`} >
                            <p
                                className={
                                    `
                                w-full cursor-pointer ${!readMore ? 'overflow-hidden text-nowrap text-ellipsis' : ''}
                                ${text.length == 0 ? 'text-gray-400' : ''}
                                `
                                }
                                onDoubleClick={handleReadonlyDoubleClick}
                                onClick={() => { setReadMore(!readMore) }}
                            >{text ? text : 'Untitled'}</p>
                        </div>
                    }
                    {!readonly &&
                        <button
                            className={`
                            inline-flex text-red-700 hover:text-red-800 text-sm items-center justify-center shrink-0 grow-0 w-5 h-5 cursor-pointer opacity-70 hover:opacity-100
                            `
                            }
                            onClick={(e) => { e.stopPropagation(); onDelete?.() }}
                        >
                            <BsTrash />
                        </button>
                    }
                    {readonly &&
                        <span className='inline-flex shrink-0 items-end w-10 justify-end'>
                            {percentage.toFixed(0)}%
                        </span>
                    }
                </div>

                <div className="relative w-full h-2 rounded-full overflow-hidden">
                    {progressType == 'progress' &&
                        <div className='w-full h-full bg-gray-300' >
                            <div
                                className="absolute h-full bg-red-500 transition-all duration-300 rounded-full"
                                style={{ width: `${percentage ?? 30}%` }}
                            />
                        </div>
                    }
                    {progressType == 'step' &&
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
                    <div className='text-[13px] flex justify-between text-gray-700 font-normal' >
                        <div>{completed}/{total} tasks completed</div>
                        <span>{percentage.toFixed(0)}%</span>
                    </div>
                }
            </div>

        </div>

    );
};

export default TodoGroupCard;
