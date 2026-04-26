import React, { useEffect, useRef, useState } from 'react'
import TodoItemCard from './TodoItemCard'
import reorderByIndex from '../utils/reorderByIndex';
import createClone from '../utils/createClone';
import { EmptyStateBackground } from './EmptyStateBackground';
import ReorderingOverlay from './ReorderingOverlay';
import areArraysEqualByIdAndSort from '../utils/areArraysEqualByIdAndSort';

function move<T>(arr: T[], selectedIndex: number, movedToIndex: number): T[] {
    const result = [...arr];

    const [item] = result.splice(selectedIndex, 1);
    result.splice(movedToIndex, 0, item);

    return result;
}

type ReorderParams = {
    from: {
        index: number;
        sortOrder: number;
    };
    to?: {
        index?: number;
        sortOrder?: number;
    };
};


type Item = { id: number, sortOrder: number, value: string, checked: boolean };

export interface Props {
    data?: Item[]

    deleteId?: number;
    focusId?: number;

    volume: number;
    onReorder?(args: { id: number, sortOrder: number }[]): void;

    onDelete?: (itemId: number, focusId?: number) => void,
    onChangeText: (itemId: number, value: string) => void,

    onClickCheck: (itemId: number, value: boolean) => void,
    onHitEnter: (sortOrder: number) => void,

    onUp?: (itemId?: number) => void;
    onDown?: (itemId?: number) => void;
    onClickFocus?: (itemId: number) => void;
    onClearFocus?: (itemId: number) => void;

    onEmptyDelete?: (itemId: number, focusId?: number) => void;

    isEmpty?: boolean;
    onCreateNew?(): void;
    isLoading?: boolean;
    isReordering?: boolean;
}


const TodoItems = ({ data, onDelete, volume, onChangeText, onClickCheck, onHitEnter, focusId, onReorder, isEmpty, onCreateNew, isLoading, deleteId, onUp, onDown, onClickFocus, onClearFocus, isReordering }: Props) => {
    const [items, setItems] = useState<Props['data']>(data);
    const containerRef = useRef<HTMLDivElement | null>(null);

    const cloneRef = useRef<HTMLElement | null>(null);
    const [dragSortOrder, setDragSortOrder] = useState<number | null>(null);
    const [hoverSortOrder, setHoverSortOrder] = useState<number | null>(null);
    const [dragIndex, setDragIndex] = useState<number | null>(null);
    const [overIndex, setOverIndex] = useState<number | null>(null);
    const isSortingRef = useRef<boolean>(false);

    const scrollSpeed = 10;
    const scrollThreshold = 80;

    useEffect(() => {
        setItems(data);
        isSortingRef.current = false;
    }, [data])


    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, dragSortOrder: number, dragIndex: number) => {
        setDragSortOrder(dragSortOrder);
        setDragIndex(dragIndex);

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
        setOverIndex(targetIndex);
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

        if (items && typeof dragSortOrder == 'number' && typeof hoverSortOrder == 'number' && dragIndex != overIndex) {
            let reordered = reorderByIndex<Item>(items, dragSortOrder, hoverSortOrder);
            onReorder?.(reordered);
        }

        setDragSortOrder(null);
        setHoverSortOrder(null);
    };

    const handleAltReorder = ({ from, to }: ReorderParams) => {
        if (isReordering) return;

        console.log(to);

        const toSortOrder = to?.sortOrder;
        if (typeof toSortOrder !== 'number') return;
        if (typeof data == 'undefined') return;
        if (typeof items == 'undefined') return;
        if (!areArraysEqualByIdAndSort(data, items)) return;
        if (isSortingRef.current) return;
        isSortingRef.current = true;

        setItems(prev => {
            if (!prev) return prev;

            const fromIndex = prev.findIndex(g => g.sortOrder === from.sortOrder);
            const toIndex = prev.findIndex(g => g.sortOrder === toSortOrder);

            if (fromIndex === -1 || toIndex === -1) return prev;
            if (fromIndex === toIndex) return prev;

            const tempReorder = move(prev, fromIndex, toIndex);

            const reordered = reorderByIndex<Item>(
                tempReorder as Item[],
                from.sortOrder,
                toSortOrder
            );

            onReorder?.(reordered);
            return tempReorder;
        });
    };


    return (
        <div
            ref={containerRef}
            className='relative flex-1 mt-2.5 space-y-2.5! min-h-0 scroll-hidden scroll-smooth overflow-auto'
        >
            {
                items?.map(({ id, sortOrder, value, checked }, idx) => {

                    let prevSortOrder: number | undefined;
                    let nextSortOrder: number | undefined;

                    let prevIndex: number | undefined;
                    let nextIndex: number | undefined;

                    let prevFocusId: number | undefined;
                    let nextFocusId: number | undefined;
                    let deleteFocusId: number | undefined;

                    if (items.length > 0) {
                        if (idx > 0) {
                            prevFocusId = items[idx - 1].id;
                        } else {
                            prevFocusId = items[0].id;
                        }

                        if (idx < items.length - 1) {
                            nextFocusId = items[idx + 1].id;
                        } else {
                            nextFocusId = items[idx].id;
                        }

                    }

                    if (items.length > 1) {
                        if (idx < items.length - 1) {
                            deleteFocusId = items[idx + 1].id;
                        } else {
                            deleteFocusId = items[idx - 1].id;
                        }
                    }

                    if (idx > 0) {

                        prevSortOrder = items[idx - 1].sortOrder;
                        prevIndex = idx - 1;
                    }

                    if (idx < items.length - 1) {
                        nextSortOrder = items[idx + 1].sortOrder;
                        nextIndex = idx + 1;
                    }



                    let altUpArgs: ReorderParams = {
                        from: {
                            sortOrder,
                            index: idx
                        },
                        to: {
                            sortOrder: prevSortOrder,
                            index: prevIndex
                        }
                    }

                    let altDownArgs: ReorderParams = {
                        from: {
                            sortOrder,
                            index: idx
                        },
                        to: {
                            sortOrder: nextSortOrder,
                            index: nextIndex
                        }
                    }

                    return (
                        <TodoItemCard
                            key={`${id}_${sortOrder}`}
                            value={value}
                            checked={checked}

                            focus={focusId == id}
                            isDeleting={deleteId == id}

                            volume={volume}
                            hide={sortOrder == dragSortOrder}

                            onAltUp={() => { handleAltReorder(altUpArgs) }}
                            onAltDown={() => { handleAltReorder(altDownArgs) }}

                            onChangeText={(value) => { onChangeText(id, value) }}
                            onClickCheck={(value) => { onClickCheck(id, value) }}
                            onHitEnter={() => { onHitEnter(sortOrder + 1) }}
                            onDelete={() => { onDelete?.(id, deleteFocusId) }}
                            onUp={() => { onUp?.(prevFocusId) }}
                            onDown={() => { onDown?.(nextFocusId) }}

                            onClickFocus={() => { onClickFocus?.(Number(id)) }}
                            onClearFocus={() => { onClearFocus?.(Number(id)) }}

                            onDragStart={(e) => { handleDragStart(e, sortOrder, idx) }}
                            onDragOver={(e) => { handleDragOver(e, idx) }}
                            onDragEnd={handleDragEnd}

                        />
                    )
                })

            }
            {isEmpty &&
                <EmptyStateBackground
                    onClick={onCreateNew}
                    type='task'
                    isLoading={isLoading}
                />
            }
            {isReordering &&
                <ReorderingOverlay />
            }
        </div>
    )
}

export default TodoItems

