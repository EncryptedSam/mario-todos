import React, { useEffect, useRef, useState } from 'react'
import NavBar from '../components/ui/NavBar'
import TodoGroupCard from '../components/ui/TodoGroupCard'
import TodoItemCard from '../components/ui/TodoItemCard'
import AddNewButton from '../components/ui/AddNewButton'
import { useNavigate } from 'react-router-dom'
import { getGroupByIdWithStats } from '../services/todoGroup.service'
import { useParams } from "react-router-dom";
import type { TodoGroupWithStats, TodoItem } from '../db/schema'
import { getVolume, setVolume } from '../services/settings.service'
import { getItemsByGroup, createItem, updateItemCompleted, updateItemContent, deleteItem } from '../services/todoItem.service'
import Confetti from 'react-confetti'

const TodoItemsContainers = () => {
    const navigate = useNavigate();
    const { id: groupId } = useParams();

    const [filter, setFilter] = useState<string>('all');
    const [localVolume, setLocalVolume] = useState<number>(0);
    const [itemId, setItemId] = useState<number | null>(null);

    const [group, setGroup] = useState<TodoGroupWithStats>();
    const [items, setItems] = useState<TodoItem[]>([]);

    const listRef = useRef<HTMLDivElement | null>(null);
    const itemIdTimeoutRef = useRef<number | undefined>(undefined);




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
            await loadVolume();
            await loadGroup();
            await loadItems();
        })();
    }, []);

    let percentage = 0;

    if (group) {
        percentage = (group.completed / group.total) * 100;
        if (group.total == 0) {
            percentage = 0;
        }
    }

    const handleCreateItem = async () => {
        const res = await createItem(Number(groupId), '');
        await loadItems();
        await loadGroup();

        setItemId(res);

        clearTimeout(itemIdTimeoutRef.current);

        itemIdTimeoutRef.current = setTimeout(() => {
            setItemId(null);
        }, 100)

        requestAnimationFrame(() => {
            if (listRef.current) {
                listRef.current.scrollTo({
                    top: listRef.current.scrollHeight,
                    behavior: 'smooth'
                });
            }
        });
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

    const handleDeleteItem = async (id: number) => {
        await deleteItem(Number(id));
        await loadItems();
        await loadGroup();
    }

    const handleVolume = async (value: number) => {
        setLocalVolume(value);
        setVolume(value);
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
            />
            <div className='relative  pt-2 pb-2 min-h-0 scroll-hidden overflow-auto' >
                <TodoGroupCard
                    value={group?.title ?? ''}
                    percentage={percentage}
                    taskCount={items.length + 2}
                    readOnly
                />
                <hr className='absolute opacity-50 bottom-0 left-0 right-0 m-auto w-[calc(100%-10px)] border-0 border-b-2 border-gray-200' />
            </div>
            <div
                ref={listRef}
                className='flex-1 pt-2.5 space-y-2.5! min-h-0 scroll-hidden overflow-auto'
            >
                {
                    items
                        .filter(item => getFilter(item.completed))
                        .map(({ completed, content, groupId, id }) => {
                            return (
                                <TodoItemCard
                                    key={`todo_item_${id}`}
                                    value={content}
                                    checked={completed}
                                    onClickCheck={(value) => { handleUpdateCompleted(Number(id), value) }}
                                    onChangeText={(value) => { handleUpdateContent(Number(id), value) }}
                                    onDelete={() => { handleDeleteItem(Number(id)) }}
                                    volume={(localVolume / 100) * 1}
                                    onHitEnter={handleCreateItem}
                                    focus={id == itemId}
                                />
                            )
                        })
                }
            </div>
            <AddNewButton
                type='task'
                onClick={handleCreateItem}
            />
            {
                percentage == 100 &&
                <Confetti recycle={true} />
            }
        </>
    )
}

export default TodoItemsContainers


// type BaseType = { id: number, sortOrder: number };

// function reorderSort<T extends BaseType>(array: T[]) {

// }

// type Item = { id: number, sortOrder: number, content: string }

// let ary: Item[] = [];

// reorderSort(ary);


