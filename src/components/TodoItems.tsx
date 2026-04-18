import React, { useRef } from 'react'
import TodoItemCard, { type Props as TodoItemCardProps } from './TodoItemCard'

export interface Props {
    data?: ({ sortOrder: number, id: number } & Omit<TodoItemCardProps, 'onDragStart' | 'onDragOver' | 'onDrop' | 'onDragEnter' | 'onDragLeave' | 'onDragEnd' | 'hide'>)[]

    onReorder?(args: { id: number, sortOrder: number }[]): void;
}


const TodoItems = ({ data }: Props) => {
    const containerRef = useRef<HTMLDivElement | null>(null);


    const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {

    }

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {

    }


    return (
        <div
            ref={containerRef}
            className='flex-1 pt-2.5 space-y-2.5! min-h-0 scroll-hidden scroll-smooth overflow-auto'
        >
            {
                data?.map(({ id, sortOrder, value, checked, focus, onChangeText, onClickCheck, onDelete, onHitEnter, volume }) => {

                    return (
                        <TodoItemCard
                            key={`${id}_${sortOrder}`}
                            value={value}
                            checked={checked}
                            focus={focus}
                            onChangeText={onChangeText}
                            onClickCheck={onClickCheck}
                            onDelete={onDelete}
                            onHitEnter={onHitEnter}
                            volume={volume}

                        // onDragStart={handleDragStart}
                        // onDragOver={handleDragOver}
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