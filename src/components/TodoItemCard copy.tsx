import React, { useEffect, useRef, useState, forwardRef } from 'react'
import coinSound from "../assets/sounds/mario_coin_sound.mp3";
import { MdDeleteOutline, MdOutlineEdit } from 'react-icons/md';
import useEscape from '../hooks/useEscape';
import SideDropMenu from './shared/SideDropMenu';

export interface Props {
    value: string
    onChangeText?(value: string): void;

    checked?: boolean
    onClickCheck?(value: boolean): void

    onEmptyDelete?(): void;
    onUp?(): void;
    onDown?(): void;
    onDelete?(): void;
    volume?: number

    focusKey?: number;

    onHitEnter?(): void;
    focus?: boolean;

    alignDropMenu?: 'top' | 'bottom';

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
    hide,
    alignDropMenu,
    onEmptyDelete,
    onUp,
    onDown,
    focusKey
}: Props, ref) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [text, setText] = useState(value);
    const [isChecked, setIsChecked] = useState<boolean>(checked);
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const debounceRef = useRef<number | null>(null);
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const backspaceCountRef = useRef(0);

    useEscape(() => {
        setIsEdit(false);
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
        if (focusKey && textareaRef.current) {
            setIsEdit(true);

            const el = textareaRef.current;
            el.focus();

            const length = el.value.length;
            el.setSelectionRange(length, length);
        }
    }, [focusKey]);

    useEffect(() => {
        if (text.trim() !== "") {
            backspaceCountRef.current = 0;
        }
    }, [text]);

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
        const el = textareaRef.current;
        if (!el) return;

        const cursorStart = el.selectionStart;
        const cursorEnd = el.selectionEnd;
        const length = el.value.length;

        // ENTER
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onHitEnter?.();
            setIsEdit(false);
            return;
        }

        // BACKSPACE DOUBLE EMPTY
        if (e.key === "Backspace") {
            if (text.trim() === "") {
                backspaceCountRef.current += 1;

                if (backspaceCountRef.current >= 2) {
                    e.preventDefault();
                    onEmptyDelete?.();
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

    return (
        <div
            // ref={containerRef}
            ref={(el) => {
                containerRef.current = el;

                if (typeof ref === "function") {
                    ref(el);
                } else if (ref) {
                    (ref as React.RefObject<HTMLDivElement | null>).current = el;
                }
            }}

            className={`
                rounded-2xl
                ${hide ? 'relative border border-gray-400 border-dashed bg-transparent' : 'bg-gray-100'}
                `
            }
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
                    relative p-3 group rounded-2xl text-sm flex space-x-3! border border-gray-200
                    ${isEdit ? 'border-gray-400' : ''}
                    ${hide ? 'opacity-0' : ''}
                `}
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

                <div className='relative flex flex-1' >
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
                            onDoubleClick={() => {
                                setIsEdit(true);
                            }}
                        />
                    }
                </div>

                <SideDropMenu
                    alignBottm={alignDropMenu == 'bottom'}
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

            </div>
        </div>
    );
});

export default TodoItemCard;