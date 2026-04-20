import React, { useRef } from 'react'
import TodoItemCard, { type Props as TodoItemCardProps } from './TodoItemCard'

export interface Props {
    data?: ({ sortOrder: number, id: number } & Omit<TodoItemCardProps, 'onDragStart' | 'onDragOver' | 'onDrop' | 'onDragEnter' | 'onDragLeave' | 'onDragEnd' | 'hide' | 'volume' | 'onDelete' | 'onChangeText' | 'onClickCheck' | 'focus'>)[]


    focusId: number | null;

    volume: number;
    onReorder?(args: { id: number, sortOrder: number }[]): void;

    onDelete: (itemId: number) => void,
    onChangeText: (itemId: number, value: string) => void,

    onClickCheck: (itemId: number, value: boolean) => void,
    onHitEnter: (sortOrder: number) => void,
}


const TodoItems = ({ data, onDelete, volume, onChangeText, onClickCheck, onHitEnter, focusId }: Props) => {
    const containerRef = useRef<HTMLDivElement | null>(null);


    const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {

    }

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {

    }
    // Does summer effect working efficiency? I'm a coder.

    return (
        <div
            ref={containerRef}
            className='flex-1 pt-2.5 space-y-2.5! min-h-0 scroll-hidden scroll-smooth overflow-auto'
        >
            {
                data?.map(({ id, sortOrder, value, checked }) => {

                    return (
                        <TodoItemCard
                            key={`${id}_${sortOrder}`}
                            value={value}
                            checked={checked}
                            focus={focusId == id}
                            volume={volume}

                            onChangeText={(value) => { onChangeText(id, value) }}
                            onClickCheck={(value) => { onClickCheck(id, value) }}
                            onDelete={() => { onDelete(id) }}
                            onHitEnter={() => { onHitEnter(sortOrder + 1) }}

                        // onDragStart={handleDragStart}
                        // onDragOver={handleDragOver}
                        // hide
                        // onDrop
                        // onDragEnter
                        // onDragLeave
                        // onDragEnd
                        />
                    )
                })

            }



        </div>
    )
}

export default TodoItems