import React, { useEffect, useRef, useState } from 'react'
import NavBar from '../components/NavBar'
import TodoGroupCard from '../components/TodoGroupCard'
import TodoItemCard from '../components/TodoItemCard'
import AddNewButton from '../components/AddNewButton'
import { useNavigate } from 'react-router-dom'
import { getGroupByIdWithStats } from '../services/todoGroup.service'
import { useParams } from "react-router-dom";
import type { TodoGroupWithStats, TodoItem } from '../db/schema'
import { getVolume, setVolume, getConfetti, setConfetti } from '../services/settings.service'
import { getItemsByGroup, createItem, bulkUpdateItemOrder, updateItemCompleted, updateItemContent, deleteItem } from '../services/todoItem.service'
import Confetti from 'react-confetti'
import reorderByIndex from '../utils/reorderByIndex'
import DeleteAlertModal from '../components/DeleteAlertModal'


function moveRowsManual<T>(array: T[], fromIndex: number, toIndex: number): T[] {
    const result = structuredClone(array);
    const item = result[fromIndex];

    if (fromIndex > toIndex) {
        for (let i = fromIndex; i > toIndex; i--) {
            result[i] = result[i - 1];
        }
    } else {
        for (let i = fromIndex; i < toIndex; i++) {
            result[i] = result[i + 1];
        }
    }

    result[toIndex] = item;
    return result;
}

const TodoItemsContainers = () => {
    const navigate = useNavigate();
    const { id: groupId } = useParams();

    const [dragIndex, setDragIndex] = useState<number | null>(null);
    const [dragOrder, setDragOrder] = useState<number | null>(null);

    const [deleteId, setDeleteId] = useState<number | null>(null);

    const [filter, setFilter] = useState<string>('all');
    const [localVolume, setLocalVolume] = useState<number>(0);
    const [inputFocusId, setInputFocusId] = useState<number | null>(null);
    const [showConfetti, setShowConfetti] = useState<boolean>(true);

    const [group, setGroup] = useState<TodoGroupWithStats>();
    const [items, setItems] = useState<TodoItem[]>([]);

    const listRef = useRef<HTMLDivElement | null>(null);
    const itemIdTimeoutRef = useRef<number | undefined>(undefined);
    const itemRefs = useRef<Map<number, HTMLDivElement>>(new Map());
    const itemsSnapRef = useRef<TodoItem[] | null>(null);

    const scrollSpeed = 10;
    const scrollThreshold = 80;

    const loadConfetti = async () => {
        const confetti = await getConfetti();
        setShowConfetti(confetti);
    }

    const loadVolume = async () => {
        const volume = await getVolume();
        setLocalVolume(volume);
    }

    const loadItems = async () => {
        const res = await getItemsByGroup(Number(groupId));
        setItems(res);
    }

    const loadGroup = async () => {
        const rows = await getGroupByIdWithStats(Number(groupId));
        setGroup(rows);
    }

    useEffect(() => {
        (async () => {
            await loadConfetti();
            await loadVolume();
            await loadGroup();
            await loadItems();
        })();
    }, []);


    const handleCreateItem = async (sortOrder?: number) => {
        setFilter('all');

        const res = await createItem(Number(groupId), '', sortOrder);
        await loadItems();
        await loadGroup();

        setInputFocusId(res);

        clearTimeout(itemIdTimeoutRef.current);

        itemIdTimeoutRef.current = setTimeout(() => {
            setInputFocusId(null);
        }, 200)

        setTimeout(() => {
            const el = itemRefs.current.get(res);
            if (!el) return;

            el.scrollIntoView({
                behavior: "smooth",
                block: "nearest",
            });
        }, 0);
    }


    const handleUpdateCompleted = async (itemId: number, value: boolean) => {
        await updateItemCompleted(Number(itemId), value);
        await loadItems();
        await loadGroup();
    }

    const handleUpdateContent = async (itemId: number, value: string) => {
        await updateItemContent(Number(itemId), value);
        await loadItems();
    }

    const handleDeleteItem = async () => {
        await deleteItem(Number(deleteId));
        await loadItems();
        await loadGroup();
        setDeleteId(null)
    }

    const handleVolume = async (value: number) => {
        setLocalVolume(value);
        setVolume(value);
    }

    const handleConfetti = async () => {
        setShowConfetti(!showConfetti);
        setConfetti(!showConfetti);
    }

    const getFilter = (completed: boolean) => {

        if (filter == 'pending') {
            return !completed
        }
        if (filter == 'completed') {
            return completed
        }

        if (filter == 'all') {
            return true
        }
    }


    const handleDragStart = (e: React.DragEvent, sortOrder: number, dragIndex: number) => {
        setDragIndex(dragIndex);
        setDragOrder(sortOrder);
        itemsSnapRef.current = [...items];

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

        setTimeout(() => {
            if (document.body.contains(clone)) {
                document.body.removeChild(clone);
            }
        }, 50);
    };

    const handleDrop = async () => {

        console.log(dragIndex);

        if (itemsSnapRef.current != null && dragIndex != null) {
            const toOrder = itemsSnapRef.current[dragIndex].sortOrder;
            const fromOrder = items[dragIndex].sortOrder;

            console.log(toOrder, fromOrder)

            const updates = reorderByIndex<TodoItem>(items, fromOrder, toOrder);

            await bulkUpdateItemOrder(updates);
            await loadItems();
            itemsSnapRef.current = null;
        }

        setDragIndex(null);
        setDragOrder(null);
    };

    const handleDragEnd = (e: React.DragEvent) => {
        (e.currentTarget as HTMLElement).style.opacity = "1";
    };

    // const handleDragOver = (e: React.DragEvent, index: number) => {
    //     e.preventDefault();

    //     handleAutoScroll(e);

    //     if (dragIndex === null) return;

    //     const target = e.currentTarget as HTMLElement;
    //     const rect = target.getBoundingClientRect();
    //     const middleY = rect.top + rect.height / 2;

    //     if (index === dragIndex) return;

    //     if (
    //         (index > dragIndex && e.clientY < middleY) ||
    //         (index < dragIndex && e.clientY > middleY)
    //     ) {
    //         return;
    //     }

    //     const newItems = moveRowsManual(items, dragIndex, index);
    //     setItems(newItems);
    //     setDragIndex(index);
    // };

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();

        handleAutoScroll(e);

        if (dragIndex === null || index === dragIndex) {
            return;
        }

        const newItems = moveRowsManual(items, dragIndex, index);
        setItems(newItems);
        setDragIndex(index);
    };

    const handleAutoScroll = (e: React.DragEvent) => {
        if (!listRef.current) return;

        const container = listRef.current;
        const rect = container.getBoundingClientRect();

        const offsetY = e.clientY - rect.top;

        if (offsetY < scrollThreshold) {
            container.scrollTop -= scrollSpeed;
        }

        if (offsetY > rect.height - scrollThreshold) {
            container.scrollTop += scrollSpeed;
        }
    };

    let percentage = 0;

    if (group) {
        percentage = (group.completed / group.total) * 100;
        if (group.total == 0) {
            percentage = 0;
        }
    }
    
    return (
        <>
            <NavBar
                filterDropDown={{
                    value: filter,
                    options: [
                        { value: 'all', lable: 'All' },
                        { value: 'pending', lable: 'Pending' },
                        { value: 'completed', lable: 'Completed' }
                    ],
                    onChange: setFilter,
                }}

                volumeSlider={{
                    value: localVolume,
                    onChange: (value) => { handleVolume(value) }
                }}

                onClickBack={() => { navigate(`/`); }}

                confettiValue={showConfetti}
                onClickConfetti={handleConfetti}
                showConfetti={percentage == 100}
            />
            <div className='relative  pt-2 pb-2 min-h-0 scroll-hidden overflow-auto' >
                {group &&
                    <TodoGroupCard
                        value={group.title ?? ''}
                        completed={group.completed}
                        total={group.total}
                        readonly
                    />
                }
                <hr className='absolute opacity-60 bottom-0 left-0 right-0 m-auto w-[calc(100%-15px)] border-0 border-b-2 border-gray-200' />
            </div>
            <div
                ref={listRef}
                className='flex-1 pt-2.5 space-y-2.5! min-h-0 scroll-hidden scroll-smooth overflow-auto'
            >
                {
                    items
                        .filter(item => getFilter(item.completed))
                        .map(({ completed, content, id, sortOrder }, idx) => {
                            return (
                                <TodoItemCard
                                    ref={(el) => {
                                        if (el) itemRefs.current.set(Number(id), el);
                                        else itemRefs.current.delete(Number(id));
                                    }}
                                    key={`todo_item_${id}`}
                                    onDelete={() => { setDeleteId(Number(id)) }}

                                    value={content}
                                    checked={completed}
                                    onClickCheck={(value) => { handleUpdateCompleted(Number(id), value) }}
                                    onChangeText={(value) => { handleUpdateContent(Number(id), value) }}
                                    volume={(localVolume / 100) * 1}

                                    onHitEnter={() => { handleCreateItem(Number(sortOrder) + 1) }}
                                    focus={id == inputFocusId}
                                    hide={dragOrder == sortOrder}
                                    onDragOver={(e) => handleDragOver(e, idx)}
                                    onDrop={handleDrop}
                                    onDragStart={(e) => { handleDragStart(e, sortOrder, idx) }}
                                    onDragEnd={handleDragEnd}
                                />
                            )
                        })
                }
            </div>
            <AddNewButton
                type='task'
                onClick={() => { handleCreateItem() }}
            />
            {
                (showConfetti && percentage == 100) &&
                <Confetti recycle={true} />
            }
            {
                deleteId &&
                <DeleteAlertModal
                    onCancel={() => { setDeleteId(null) }}
                    onDelete={handleDeleteItem}
                />
            }
        </>
    )
}

export default TodoItemsContainers

