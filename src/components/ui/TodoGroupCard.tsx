import React, { useEffect, useRef, useState } from 'react'
import ButtonGroup from './shared/ButtonGroup';
import { RiDeleteBin2Line, RiEdit2Line } from 'react-icons/ri';

interface TodoGroupProps {
    type?: 'progress' | 'step';
    readOnly?: boolean;
    percentage?: number;
    onDelete?(): void;
    value: string;
    onChange?(value: string): void;
}

const DEBOUNCE_DELAY = 400;

const TodoGroupCard = ({ percentage, readOnly, value, onChange, onDelete }: TodoGroupProps) => {
    const [text, setText] = useState(value);
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [isEdit, setIsEdit] = useState<boolean>(false);

    // sync external value
    useEffect(() => {
        setText(value);
    }, [value]);

    const autoResize = () => {
        const el = textareaRef.current;
        if (!el) return;

        el.style.height = "auto";
        el.style.height = el.scrollHeight + "px";
    };

    const handleChange = (val: string) => {
        setText(val);
        autoResize();

        // debounce
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        debounceRef.current = setTimeout(() => {
            onChange?.(val);
        }, DEBOUNCE_DELAY);
    };

    useEffect(() => {
        if (isEdit && textareaRef.current) {
            textareaRef.current.focus();
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

    return (
        <div
            ref={containerRef}
            className='relative p-3 group rounded-2xl bg-gray-100 text-sm flex flex-col space-x-3! space-y-2! border border-gray-200'
        >
            {(!readOnly && !isEdit) && (
                <ButtonGroup
                    buttons={[
                        {
                            icon: <RiEdit2Line className='text-gray-700' />,
                            onClick: () => { setIsEdit(true) }
                        },
                        {
                            icon: <RiDeleteBin2Line className='text-red-500' />,
                            onClick: onDelete
                        }
                    ]}
                    top={-10}
                    right={0}
                />
            )}

            <div className='flex w-full text-sm font-medium'>
                <textarea
                    ref={textareaRef}
                    value={text}
                    onChange={(e) => handleChange(e.target.value)}
                    rows={1}
                    placeholder="Untitled"
                    className='flex-1 resize-none overflow-hidden bg-transparent outline-none'
                    disabled={!isEdit}
                />
                <span className='inline-flex shrink-0 items-end w-10 justify-end'>
                    {percentage ?? 30}%
                </span>
            </div>

            <div className="relative w-full h-2 bg-gray-300 rounded overflow-hidden">
                <div
                    className="h-full bg-blue-500 transition-all duration-300 rounded-full"
                    style={{ width: `${percentage ?? 30}%` }}
                />
            </div>
        </div>
    );
};

export default TodoGroupCard;