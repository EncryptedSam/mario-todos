import React, { useEffect, useRef, useState } from 'react'
import TodoGroupCard from './TodoGroupCard';
import type { TodoGroupWithStats } from '../db/schema';
import createClone from '../utils/createClone';
import reorderByIndex from '../utils/reorderByIndex';
import { AiOutlineContainer } from 'react-icons/ai';
import { EmptyStateBackground } from './EmptyStateBackground';

function move<T>(arr: T[], selectedIndex: number, movedToIndex: number): T[] {
    const result = [...arr];

    const [item] = result.splice(selectedIndex, 1);
    result.splice(movedToIndex, 0, item);

    return result;
}


interface Props {
    data?: TodoGroupWithStats[];

    focusId?: number;
    onChange?(groupId: number, value: string): void;
    onDelete?(groupId: number): void;
    onClick?(groupId: number): void;

    onReorder?(args: { id: number, sortOrder: number }[]): void;

    onCreateNew?(): void;
    onHitEnter: (sortOrder: number) => void;
    onEmptyDelete?: (itemId: number, focusId?: number) => void;
    onUp?: (focusGroupId?: number) => void;
    onDown?: (focusGroupId?: number) => void;

    isEmpty?: boolean;
    isLoading?: boolean;
}

const TodoGroups = ({ data, onChange, onDelete, onClick, onHitEnter, onEmptyDelete, focusId, onUp, onDown, onReorder, isEmpty, onCreateNew, isLoading }: Props) => {
    const [groups, setGroups] = useState(data);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const cloneRef = useRef<HTMLElement | null>(null);

    const [dragSortOrder, setDragSortOrder] = useState<number | null>(null);
    const [hoverSortOrder, setHoverSortOrder] = useState<number | null>(null);
    const [dragIndex, setDragIndex] = useState<number | null>(null);
    const [overIndex, setOverIndex] = useState<number | null>(null);
    const scrollSpeed = 10;
    const scrollThreshold = 80;


    useEffect(() => {
        setGroups(data);
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
            type FixedGroup = Omit<TodoGroupWithStats, "id"> & { id: number };
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



    return (
        <div
            ref={containerRef}
            className='flex-1 pt-2.5 space-y-2.5! min-h-0 scroll-hidden overflow-auto scroll-smooth'
        >
            {
                groups?.map(({ id, title, completed, total, sortOrder }, idx) => {

                    let prevFocusId: number | undefined;
                    let nextFocusId: number | undefined;

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

                    return (
                        <TodoGroupCard
                            key={`todo_group_${id}_${sortOrder}`}
                            value={title}
                            completed={completed}
                            total={total}
                            focus={focusId == id}
                            hide={sortOrder == dragSortOrder}

                            onEmptyDelete={() => { onEmptyDelete?.(Number(id), prevFocusId) }}
                            onChange={(value) => { onChange?.(Number(id), value) }}
                            onDelete={() => { onDelete?.(Number(id)) }}
                            onClick={() => { onClick?.(Number(id)) }}
                            onHitEnter={() => { onHitEnter(sortOrder + 1) }}

                            onUp={() => { onUp?.(prevFocusId) }}
                            onDown={() => { onDown?.(nextFocusId) }}

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
        </div>
    )
}

export default TodoGroups