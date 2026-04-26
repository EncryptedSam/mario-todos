import React, { useEffect, useRef, useState } from 'react'
import TodoGroupCard from './TodoGroupCard';
import type { TodoGroupWithStats } from '../db/schema';
import createClone from '../utils/createClone';
import reorderByIndex from '../utils/reorderByIndex';
import { EmptyStateBackground } from './EmptyStateBackground';
import ReorderingOverlay from './ReorderingOverlay';

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

type WithIdAndSort = {
    id?: number;
    sortOrder: number;
};

function areArraysEqualByIdAndSort<T extends WithIdAndSort>(
    a: T[],
    b: T[]
): boolean {
    if (a.length !== b.length) return false;

    const map = new Map<number, number>();

    for (const item of a) {
        if (item.id == null) return false;
        map.set(item.id, item.sortOrder);
    }

    for (const item of b) {
        if (item.id == null) return false;
        if (!map.has(item.id)) return false;
        if (map.get(item.id) !== item.sortOrder) return false;
    }

    return true;
}

type FixedGroup = Omit<TodoGroupWithStats, "id"> & { id: number };

interface Props {
    data?: TodoGroupWithStats[];

    deleteId?: number;
    focusId?: number;
    onChange?(groupId: number, value: string): void;
    onDelete?: (groupId: number, focusId?: number) => void,
    onClick?(groupId: number): void;

    onReorder?(args: { id: number, sortOrder: number }[]): void;

    onCreateNew?(): void;
    onHitEnter: (sortOrder: number) => void;
    onEmptyDelete?: (itemId: number, focusId?: number) => void;
    onUp?: (focusGroupId?: number) => void;
    onDown?: (focusGroupId?: number) => void;
    onClickFocus?: (groupId: number) => void;
    onClearFocus?: (groupId: number) => void;

    isEmpty?: boolean;
    isLoading?: boolean;
    isReordering?: boolean;
}

const TodoGroups = ({ data, onChange, onDelete, onClick, onHitEnter, onEmptyDelete, focusId, deleteId, onUp, onDown, onReorder, isEmpty, onCreateNew, isLoading, onClickFocus, onClearFocus, isReordering }: Props) => {
    const [groups, setGroups] = useState(data);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const cloneRef = useRef<HTMLElement | null>(null);

    const [dragSortOrder, setDragSortOrder] = useState<number | null>(null);
    const [hoverSortOrder, setHoverSortOrder] = useState<number | null>(null);
    const [dragIndex, setDragIndex] = useState<number | null>(null);
    const [overIndex, setOverIndex] = useState<number | null>(null);
    const scrollSpeed = 10;
    const scrollThreshold = 80;
    const isSortingRef = useRef<boolean>(false);

    useEffect(() => {
        setGroups(data);
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

        if (typeof groups != 'object') return;
        let hoverSortOrder = groups[overIndex].sortOrder;

        if (hoverSortOrder == dragSortOrder) return;

        const fromIndex = groups.findIndex(group => group.sortOrder === dragSortOrder);

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

        const reordered = move<TodoGroupWithStats>(groups, fromIndex, targetIndex);
        setHoverSortOrder(groups[targetIndex].sortOrder);
        setOverIndex(targetIndex);
        setGroups(reordered);
    }

    const handleDragEnd = () => {
        if (cloneRef.current) {
            document.body.removeChild(cloneRef.current);
        }

        if (groups && typeof dragSortOrder == 'number' && typeof hoverSortOrder == 'number' && dragIndex != overIndex) {

            let reordered = reorderByIndex<FixedGroup>(groups as FixedGroup[], dragSortOrder, hoverSortOrder);
            onReorder?.(reordered);
        }

        setDragSortOrder(null);
        setHoverSortOrder(null);
    };

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

    const handleAltReorder = ({ from, to }: ReorderParams) => {
        if (isReordering) return;

        const toSortOrder = to?.sortOrder;
        if (typeof toSortOrder !== 'number') return;
        if (typeof data == 'undefined') return;
        if (typeof groups == 'undefined') return;
        if (!areArraysEqualByIdAndSort(data, groups)) return;
        if (isSortingRef.current) return;
        isSortingRef.current = true;

        setGroups(prev => {
            if (!prev) return prev;

            const fromIndex = prev.findIndex(g => g.sortOrder === from.sortOrder);
            const toIndex = prev.findIndex(g => g.sortOrder === toSortOrder);

            if (fromIndex === -1 || toIndex === -1) return prev;
            if (fromIndex === toIndex) return prev;

            const tempReorder = move(prev, fromIndex, toIndex);

            const reordered = reorderByIndex<FixedGroup>(
                tempReorder as FixedGroup[],
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
            className='relative flex-1 pt-2.5 space-y-2.5! min-h-0 scroll-hidden overflow-auto scroll-smooth'
        >
            {
                groups?.map(({ id, title, completed, total, sortOrder }, idx) => {

                    let prevSortOrder: number | undefined;
                    let nextSortOrder: number | undefined;

                    let prevIndex: number | undefined;
                    let nextIndex: number | undefined;

                    let prevFocusId: number | undefined;
                    let nextFocusId: number | undefined;

                    let deleteFocusId: number | undefined;

                    if (groups.length > 0) {
                        if (idx > 0) {
                            prevFocusId = groups[idx - 1].id;
                        } else {
                            prevFocusId = groups[0].id;
                        }

                        if (idx < groups.length - 1) {
                            nextFocusId = groups[idx + 1].id;
                        } else {
                            nextFocusId = groups[idx].id;
                        }
                    }

                    if (groups.length > 1) {
                        if (idx < groups.length - 1) {
                            deleteFocusId = groups[idx + 1].id;

                        } else {
                            deleteFocusId = groups[idx - 1].id;
                        }
                    }

                    if (idx > 0) {

                        prevSortOrder = groups[idx - 1].sortOrder;
                        prevIndex = idx - 1;
                    }

                    if (idx < groups.length - 1) {
                        nextSortOrder = groups[idx + 1].sortOrder;
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
                        <TodoGroupCard
                            key={`todo_group_${id}_${sortOrder}`}
                            value={title}
                            completed={completed}
                            total={total}
                            focus={focusId == id}
                            isDeleting={deleteId == id}
                            hide={sortOrder == dragSortOrder}

                            onEmptyDelete={() => { onEmptyDelete?.(Number(id), prevFocusId) }}
                            onChange={(value) => { onChange?.(Number(id), value) }}
                            onDelete={() => { onDelete?.(Number(id), deleteFocusId) }}
                            onClick={() => { onClick?.(Number(id)) }}

                            onCtrolEnter={() => { onClick?.(Number(id)) }}
                            onHitEnter={() => { onHitEnter(sortOrder + 1) }}
                            onUp={() => { onUp?.(prevFocusId) }}
                            onDown={() => { onDown?.(nextFocusId) }}

                            onAltUp={() => { handleAltReorder(altUpArgs) }}
                            onAltDown={() => { handleAltReorder(altDownArgs) }}

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
                    type='group'
                    isLoading={isLoading}
                />
            }
            {isReordering &&
                <ReorderingOverlay />
            }
        </div>
    )
}

export default TodoGroups




