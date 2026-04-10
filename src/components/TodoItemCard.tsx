import React, { useEffect, useRef, useState, forwardRef } from 'react'
import coinSound from "../assets/sounds/mario_coin_sound.mp3";
import { MdDeleteOutline, MdOutlineEdit } from 'react-icons/md';
import useEscape from '../hooks/useEscape';
import SideDropMenu from './shared/SideDropMenu';

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
    );
});

export default TodoItemCard;