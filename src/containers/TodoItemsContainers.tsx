import React, { useEffect, useMemo, useRef, useState } from 'react'
import NavBar from '../components/NavBar'
import TodoGroupCard from '../components/TodoGroupCard'
import AddNewButton from '../components/AddNewButton'
import { useNavigate } from 'react-router-dom'
import { getGroupByIdWithStats } from '../services/todoGroup.service'
import { useParams } from "react-router-dom";
import type { TodoGroupWithStats, TodoItem } from '../db/schema'
import { getVolume, setVolume, getConfetti, setConfetti } from '../services/settings.service'
import { getItemsByGroup, createItem, bulkUpdateItemOrder, updateItemCompleted, updateItemContent, deleteItem } from '../services/todoItem.service'
import Confetti from 'react-confetti'
import DeleteAlertModal from '../components/DeleteAlertModal'
import TodoItems, { type Props as TodoItemsProps } from '../components/TodoItems'


const TodoItemsContainers = () => {
    const navigate = useNavigate();
    const { id: groupId } = useParams();

    const [deleteId, setDeleteId] = useState<number | null>(null);

    const [filter, setFilter] = useState<string>('all');
    const [localVolume, setLocalVolume] = useState<number>(0);
    const [inputFocusId, setInputFocusId] = useState<number | null>(null);
    const [showConfetti, setShowConfetti] = useState<boolean>(true);

    const [group, setGroup] = useState<TodoGroupWithStats>();
    const [items, setItems] = useState<TodoItem[]>([]);

    const itemIdTimeoutRef = useRef<number | undefined>(undefined);
    const itemRefs = useRef<Map<number, HTMLDivElement>>(new Map());


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

    const handleBulkReorder = async (items: { id: number; sortOrder: number }[]) => {
        await bulkUpdateItemOrder(items);
        await loadItems();
    }

    const handleDeleteItem = async () => {
        if (typeof deleteId == 'number') {
            await deleteItem(deleteId);
            await loadItems();
            await loadGroup();
            setDeleteId(null)
        }
    }

    const handleDeleteItemOnEmpty = async (id: number, focusId?: number) => {
        await deleteItem(id);
        await loadItems();
        await loadGroup();
        setDeleteId(null)
        if (focusId) {
            setInputFocusId(focusId);
            clearTimeout(itemIdTimeoutRef.current);

            itemIdTimeoutRef.current = setTimeout(() => {
                setInputFocusId(null);
            }, 200)
        }
    }

    const handleVolume = async (value: number) => {
        setLocalVolume(value);
        setVolume(value);
    }

    const handleConfetti = async () => {
        setShowConfetti(!showConfetti);
        setConfetti(!showConfetti);
    }

    let percentage = 0;

    if (group) {
        percentage = (group.completed / group.total) * 100;
        if (group.total == 0) {
            percentage = 0;
        }
    }

    const mappedItems: TodoItemsProps['data'] = useMemo(() => {
        return items.map(({ completed, content, sortOrder, id }) => {

            return {
                id: Number(id),
                sortOrder,
                value: content,
                checked: completed
            }
        });
    }, [items])


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
                        type='step'
                        readonly
                    />
                }
                <hr className='absolute opacity-60 bottom-0 left-0 right-0 m-auto w-[calc(100%-15px)] border-0 border-b-2 border-gray-200' />
            </div>
            <TodoItems
                data={mappedItems}
                focusId={inputFocusId}
                volume={(localVolume / 100) * 1}
                onDelete={(id) => { setDeleteId(Number(id)) }}
                onChangeText={(id, value) => { handleUpdateContent(id, value) }}
                onClickCheck={(id, value) => { handleUpdateCompleted(id, value) }}
                onHitEnter={(sortOrder) => { handleCreateItem(sortOrder) }}
                onReorder={handleBulkReorder}
                onEmptyDelete={handleDeleteItemOnEmpty}
            />
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

