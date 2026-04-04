import React, { useEffect, useRef, useState } from 'react'
import coinSound from "../../assets/sounds/mario_coin_sound.mp3";
import ButtonGroup from './shared/ButtonGroup';
import { RiDeleteBin2Line, RiEdit2Line } from 'react-icons/ri';
import { MdDeleteOutline, MdOutlineEdit, MdOutlineEditOff } from 'react-icons/md';

interface Props {
    value: string
    onChangeText?(value: string): void;

    checked?: boolean
    onClickCheck?(value: boolean): void

    onDelete?(): void;
}

const DEBOUNCE_DELAY = 400;

const TodoItemCard = ({
    value,
    onChangeText,
    checked = false,
    onClickCheck,
    onDelete
}: Props) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [text, setText] = useState(value);
    const [isChecked, setIsChecked] = useState<boolean>();
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const debounceRef = useRef<number | null>(null);
    const [isEdit, setIsEdit] = useState<boolean>(false);

    const autoResize = () => {
        const el = textareaRef.current;
        if (!el) return;

        el.style.height = "auto";
        el.style.height = el.scrollHeight + "px";
    };

    useEffect(() => {
        setText(value);
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
            audio.volume = 0.3;
            audio.play();
        }
        onClickCheck?.(checked);
    };

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

    return (
        <div
            ref={containerRef}
            className='relative p-3 group rounded-2xl bg-gray-100 text-sm flex space-x-3! border border-gray-200'
        >
            <ButtonGroup
                buttons={buttonGroupButtons}
                top={-10}
                right={0}
                alwaysVisible={isEdit}
            />

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
                className='flex-1 resize-none overflow-hidden bg-transparent outline-none'
                onChange={(e) => handleTextareaChange(e.target.value)}
                rows={1}
                placeholder="Untitled"
                value={text}
                disabled={!isEdit}
            />
        </div>
    );
};

export default TodoItemCard;