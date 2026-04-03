import React, { useRef, useState } from 'react'
import ButtonGroup from './ButtonGroup';
import { RiDeleteBin2Line, RiEdit2Line } from 'react-icons/ri';


interface TodoGroupProps {
    type?: 'progress' | 'step'
    readOnly?: boolean;
    percentage?: number
    dots?: number;
}


const TodoGroupCard = ({ percentage, dots, readOnly }: TodoGroupProps) => {
    const [text, setText] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    const autoResize = () => {
        const el = textareaRef.current;
        if (!el) return;

        el.style.height = "auto";
        el.style.height = el.scrollHeight + "px";
    };

    const arr = Array.from({ length: dots ?? 5 });

    return (
        <div className='relative p-3 group rounded-2xl bg-gray-100 text-sm flex flex-col space-x-3! space-y-2! border border-gray-200' >
            {
                !readOnly &&
                <ButtonGroup
                    buttons={[
                        {
                            icon: <RiEdit2Line className='text-gray-700' />
                        },
                        {
                            icon: <RiDeleteBin2Line className='text-red-500' />
                        }
                    ]}
                    top={-10}
                    right={0}
                />
            }
            <div className='flex w-full text-sm font-medium'>
                <textarea
                    ref={textareaRef}
                    value={text}
                    onChange={(e) => {
                        setText(e.target.value);
                        autoResize();
                    }}
                    rows={1}
                    placeholder="Untitled"
                    className='flex-1 resize-none overflow-hidden bg-transparent outline-none'
                />
                <span className='inline-flex shrink-0 items-end w-10 justify-end'>100%</span>
            </div>

            <div className="relative w-full h-2 bg-gray-300 rounded overflow-hidden">
                <div
                    className="h-full bg-blue-500 transition-all duration-300 rounded-full"
                    style={{ width: `${percentage ?? 30}%` }}
                />
                <div className='absolute w-full h-full top-0 left-0 flex justify-between items-center' >
                    {
                        arr.map((_, idx) => {
                            return (
                                <div
                                    key={`dot_${idx}`}
                                    className='h-1.5 w-1.5 bg-gray-100 first-of-type:opacity-0 last-of-type:opacity-0 rounded-full'
                                />
                            )
                        })
                    }
                </div>
            </div>

        </div>
    )
}



export default TodoGroupCard