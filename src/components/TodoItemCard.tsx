import React, { useEffect, useRef, useState } from 'react'
import coinSound from "../assets/sounds/mario_coin_sound.mp3";
import useEscape from '../hooks/useEscape';
import { BsTrash } from 'react-icons/bs';

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

    onClickFocus?(): void;
    onClearFocus?(): void;
    onHitEnter?(): void;
    focus?: boolean;
    isDeleting?: boolean;

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

const TodoItemCard = ({
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
    onEmptyDelete,
    onUp,
    onDown,
    onClickFocus
}: Props) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [text, setText] = useState(value);
    const [isChecked, setIsChecked] = useState<boolean>(checked);
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const debounceRef = useRef<number | null>(null);
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const backspaceCountRef = useRef(0);
    const isTextAreaSelectedRef = useRef<boolean>(false);


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

    const blurTextArea = () => {
        if (textareaRef.current) {
            const el = textareaRef.current;
            el.blur();
        }
    }

    useEscape(() => {
        setIsEdit(false);
    });

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

    const handleTextAreaClick = (e: React.MouseEvent<HTMLTextAreaElement>) => {
        e.stopPropagation();
        isTextAreaSelectedRef.current = true;
        onClickFocus?.();
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        const el = textareaRef.current;
        if (!el) return;

        const cursorStart = el.selectionStart;
        const cursorEnd = el.selectionEnd;
        const length = el.value.length;

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
            ref={containerRef}

            className={`
                relative rounded-2xl transition-none
                ${hide ? 'border border-gray-400 border-dashed bg-transparent' : 'bg-gray-100'}
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

                <textarea
                    ref={textareaRef}
                    className={`
                            flex-1 w-full resize-none overflow-hidden bg-transparent outline-none 
                            `
                    }
                    onChange={(e) => handleTextareaChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    rows={1}
                    placeholder="Untitled"
                    onClick={handleTextAreaClick}
                    value={text}
                />


                <button
                    className={
                        `
                        inline-flex text-red-700 hover:text-red-800 text-sm items-center justify-center shrink-0 grow-0 w-5 h-5 cursor-pointer opacity-70 hover:opacity-100
                        `
                    }
                    onClick={(e) => { e.stopPropagation(); onDelete?.() }}
                >
                    <BsTrash />
                </button>

            </div>
        </div>
    );
}

export default TodoItemCard;