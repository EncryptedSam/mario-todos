import React, { useEffect, useRef, useState } from 'react'
import TodoItemCard, { type Props as TodoItemCardProps } from './TodoItemCard'


function move<T>(arr: T[], selectedIndex: number, movedToIndex: number): T[] {
    const result = [...arr];

    const [item] = result.splice(selectedIndex, 1);
    result.splice(movedToIndex, 0, item);

    return result;
}


function createClone(e: React.DragEvent): HTMLElement {
    const target = e.currentTarget as HTMLElement;

    const rect = target.getBoundingClientRect();

    const clone = target.cloneNode(true) as HTMLElement;

    clone.style.width = `${rect.width}px`;
    clone.style.height = `${rect.height}px`;

    clone.style.position = "fixed";
    clone.style.top = "-9999px";
    clone.style.left = "-9999px";

    clone.style.borderRadius = "12px";
    clone.style.overflow = "hidden";
    clone.style.boxShadow = "0 8px 20px rgba(0,0,0,0.2)";
    clone.style.boxSizing = "border-box";
    clone.style.background = "rgba(243, 244, 246, 0.8)";

    document.body.appendChild(clone);

    e.dataTransfer.setDragImage(clone, rect.width / 2, rect.height / 2);
    return clone;
}

type Item = { id: number, sortOrder: number, value: string, checked: boolean };

export interface Props {
    data?: Item[]


    focusId: number | null;

    volume: number;
    onReorder?(args: { id: number, sortOrder: number }[]): void;

    onDelete: (itemId: number) => void,
    onChangeText: (itemId: number, value: string) => void,

    onClickCheck: (itemId: number, value: boolean) => void,
    onHitEnter: (sortOrder: number) => void,
}


const TodoItems = ({ data, onDelete, volume, onChangeText, onClickCheck, onHitEnter, focusId }: Props) => {
    const [items, setItems] = useState<Props['data']>(data);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const cloneRef = useRef<HTMLElement | null>(null);
    const [dragSortOrder, setDragSortOrder] = useState<number | null>(null);

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, dragSortOrder: number) => {
        setDragSortOrder(dragSortOrder);

        if (cloneRef != null) {
            cloneRef.current = createClone(e);
        }

    }

    function handleDragOver(e: React.DragEvent<HTMLDivElement>, overIndex: number) {
        e.preventDefault();

        const rect = e.currentTarget.getBoundingClientRect();

        const offsetY = e.clientY - rect.top;
        const half = rect.height / 2;


        if (typeof items != 'object') return;
        let hoverSortOrder = items[overIndex].sortOrder;

        if (hoverSortOrder == dragSortOrder) return;

        const fromIndex = items.findIndex(item => item.sortOrder === dragSortOrder);

        if (offsetY < half) {
            let toIndex = overIndex;
            const reordered = move<Item>(items, fromIndex, toIndex);
            setItems(reordered);

        } else {
            const toIndex = overIndex + 1;
            const reordered = move<Item>(items, fromIndex, toIndex);
            setItems(reordered);

        }
    }

    useEffect(() => {
        if (typeof data == 'object' && data.length > 0) {
            setItems(data);
        }
    }, [data])

    const handleDragEnd = () => {
        if (cloneRef.current) {
            document.body.removeChild(cloneRef.current);
        }
        setDragSortOrder(null);
    };

    return (
        <div
            ref={containerRef}
            className='flex-1 pt-2.5 space-y-2.5! min-h-0 scroll-hidden scroll-smooth overflow-auto'
        >
            {
                items?.map(({ id, sortOrder, value, checked }, idx) => {

                    return (
                        <TodoItemCard
                            key={`${id}_${sortOrder}`}
                            value={value}
                            checked={checked}
                            focus={focusId == id}
                            volume={volume}
                            hide={sortOrder == dragSortOrder}

                            onChangeText={(value) => { onChangeText(id, value) }}
                            onClickCheck={(value) => { onClickCheck(id, value) }}
                            onDelete={() => { onDelete(id) }}
                            onHitEnter={() => { onHitEnter(sortOrder + 1) }}

                            onDragStart={(e) => { handleDragStart(e, sortOrder) }}
                            onDragEnd={handleDragEnd}
                            onDragOver={(e) => { handleDragOver(e, idx) }}
                        // hide
                        // onDrop
                        // onDragEnter
                        // onDragLeave
                        />
                    )
                })

            }



        </div>
    )
}

export default TodoItems

