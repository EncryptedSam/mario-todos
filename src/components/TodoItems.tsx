import React, { useEffect, useRef, useState } from 'react'
import TodoItemCard from './TodoItemCard'
import reorderByIndex from '../utils/reorderByIndex';

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

    onEmptyDelete?: (itemId: number, focusId?: number) => void;
}


const TodoItems = ({ data, onDelete, volume, onChangeText, onClickCheck, onHitEnter, focusId, onReorder, onEmptyDelete }: Props) => {
    const [items, setItems] = useState<Props['data']>(data);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const cloneRef = useRef<HTMLElement | null>(null);
    const [dragSortOrder, setDragSortOrder] = useState<number | null>(null);
    const [hoverSortOrder, setHoverSortOrder] = useState<number | null>(null);
    const [focusState, setFocusState] = useState<{ id: number, key: number } | null>(null);

    const scrollSpeed = 10;
    const scrollThreshold = 80;

    useEffect(() => {
        setItems(data);
    }, [data])


    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, dragSortOrder: number) => {
        setDragSortOrder(dragSortOrder);

        if (cloneRef != null) {
            cloneRef.current = createClone(e);
        }
    }

    function handleDragOver(e: React.DragEvent<HTMLDivElement>, overIndex: number) {
        e.preventDefault();
        handleAutoScroll(e);

        const rect = e.currentTarget.getBoundingClientRect();

        const offsetY = e.clientY - rect.top;
        const threshold = rect.height / 2;

        if (typeof items != 'object') return;
        let hoverSortOrder = items[overIndex].sortOrder;

        if (hoverSortOrder == dragSortOrder) return;

        const fromIndex = items.findIndex(item => item.sortOrder === dragSortOrder);

        let toIndex = overIndex;

        const isAbove = offsetY < threshold;
        const isBelow = offsetY > rect.height - threshold;

        if (!isAbove && !isBelow) return;

        let targetIndex = toIndex;

        if (isAbove) {
            if (fromIndex < toIndex && toIndex - fromIndex === 1) return;
        } else {
            if (!(fromIndex < toIndex && toIndex - fromIndex === 1)) {
                targetIndex = toIndex + 1;
            }
        }

        const reordered = move<Item>(items, fromIndex, targetIndex);
        setHoverSortOrder(items[targetIndex].sortOrder);
        setItems(reordered);
    }

    const handleAutoScroll = (e: React.DragEvent) => {
        if (!containerRef.current) return;

        const container = containerRef.current;
        const rect = container.getBoundingClientRect();

        const offsetY = e.clientY - rect.top;

        if (offsetY < scrollThreshold) {
            container.scrollTop -= scrollSpeed;
        }

        if (offsetY > rect.height - scrollThreshold) {
            container.scrollTop += scrollSpeed;
        }
    };

    const handleDragEnd = () => {
        if (cloneRef.current) {
            document.body.removeChild(cloneRef.current);
        }

        if (items && typeof dragSortOrder == 'number' && typeof hoverSortOrder == 'number') {
            let reordered = reorderByIndex<Item>(items, dragSortOrder, hoverSortOrder);
            onReorder?.(reordered);
        }

        setDragSortOrder(null);
        setHoverSortOrder(null);
    };

    const handleOnUp = (prevId?: number) => {
        if (prevId) {
            setFocusState({ id: prevId, key: Date.now() });
        }
    };

    const handleOnDown = (nextId?: number) => {
        if (nextId) {
            setFocusState({ id: nextId, key: Date.now() });
        }
    };

    return (
        <div
            ref={containerRef}
            className='flex-1 mt-2.5 space-y-2.5! min-h-0 scroll-hidden scroll-smooth overflow-auto'
        >
            {
                items?.map(({ id, sortOrder, value, checked }, idx) => {

                    let prevFocusId: number;
                    if (idx - 1 >= 0) {
                        prevFocusId = items[idx - 1].id;
                    }

                    let nextFocusId: number;
                    if (idx + 1 < items.length) {
                        nextFocusId = items[idx + 1].id;
                    }

                    let alignDropMenu: 'top' | 'bottom' = 'top';
                    if (idx == items.length - 1 && idx > 0) {
                        alignDropMenu = 'bottom';
                    }

                    return (
                        <TodoItemCard
                            key={`${id}_${sortOrder}`}
                            value={value}
                            checked={checked}

                            focus={focusId == id}
                            focusKey={(focusState?.id === id) ? focusState.key : undefined}

                            volume={volume}
                            hide={sortOrder == dragSortOrder}

                            onChangeText={(value) => { onChangeText(id, value) }}
                            onClickCheck={(value) => { onClickCheck(id, value) }}
                            onDelete={() => { onDelete(id) }}
                            onHitEnter={() => { onHitEnter(sortOrder + 1) }}
                            onEmptyDelete={() => { onEmptyDelete?.(id, prevFocusId) }}

                            onDragStart={(e) => { handleDragStart(e, sortOrder) }}
                            onDragEnd={handleDragEnd}
                            onDragOver={(e) => { handleDragOver(e, idx) }}
                            alignDropMenu={alignDropMenu}
                            onUp={() => { handleOnUp(prevFocusId) }}
                            onDown={() => { handleOnDown(nextFocusId) }}
                        />
                    )
                })

            }



        </div>
    )
}

export default TodoItems

