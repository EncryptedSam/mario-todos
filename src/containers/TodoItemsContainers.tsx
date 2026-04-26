import React, { useEffect, useMemo, useRef, useState } from 'react'
import NavBar from '../components/NavBar'
import TodoGroupCard from '../components/TodoGroupCard'
import AddNewButton from '../components/AddNewButton'
import { useNavigate } from 'react-router-dom'
import { getGroupByIdWithStats, updateGroup } from '../services/todoGroup.service'
import { useParams } from "react-router-dom";
import type { TodoGroupWithStats, TodoItem } from '../db/schema'
import { getVolume, setVolume, getConfetti, setConfetti } from '../services/settings.service'
import { getItemsByGroup, createItem, bulkUpdateItemOrder, updateItemCompleted, updateItemContent, deleteItem } from '../services/todoItem.service'
import Confetti from 'react-confetti'
import DeleteAlertModal from '../components/DeleteAlertModal'
import TodoItems, { type Props as TodoItemsProps } from '../components/TodoItems'
import useEscape from '../hooks/useEscape'
import KeybindingTableModal from '../components/KeybindingTableModal'
import NewlineToast from '../components/NewlineToast'
import useConfirmResolver from '../hooks/useConfirmResolver'

const TodoItemsContainers = () => {
    const navigate = useNavigate();
    const { id: groupId } = useParams();

    const [deleteId, setDeleteId] = useState<number | undefined>(undefined);

    const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
    const [localVolume, setLocalVolume] = useState<number>(0);
    const [focusId, setFocusId] = useState<number | undefined>(undefined);
    const [showConfetti, setShowConfetti] = useState<boolean>(true);
    const [showHotKeys, setShowHotKeys] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [showNewLineToast, setShowNewLineToast] = useState<boolean>(false);

    const [group, setGroup] = useState<TodoGroupWithStats>();
    const [items, setItems] = useState<TodoItem[]>([]);

    const { onConfirm, onCancel, confirm } = useConfirmResolver();
    const isReorderingRef = useRef<boolean>(false);
    const isCreatingRef = useRef<boolean>(false);

    useEscape(() => {
        setDeleteId(undefined);
        setFocusId(undefined);
    });

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Backspace") {
                if (!focusId) {
                    navigate(`/`);
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [focusId]);

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
        const group = await getGroupByIdWithStats(Number(groupId));
        setGroup(group);
    }

    useEffect(() => {
        (async () => {
            await loadConfetti();
            await loadVolume();
            await loadGroup();
            await loadItems();
            setIsLoading(false);
        })();
    }, []);

    const handleCreateItem = async (sortOrder?: number) => {
        setFilter('all');

        if (isCreatingRef.current == false) {
            isCreatingRef.current = true;
            const id = await createItem(Number(groupId), '', sortOrder);
            await loadItems();
            await loadGroup();

            if (typeof id == 'number') {
                setFocusId(id);
            }
            isCreatingRef.current = false;
        }
    }

    const handleGroupCardChange = async (id: number, value: string) => {
        await updateGroup(id, value);
        await loadGroup();
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
        if (isReorderingRef.current == false) {
            isReorderingRef.current = true;
            await bulkUpdateItemOrder(items);
            await loadItems();
            isReorderingRef.current = false;
        }
    }

    const handleDeleteItem = async (itemId: number, focusId?: number) => {

        setDeleteId(itemId);
        const ok = await confirm();
        if (ok) {
            await deleteItem(itemId);
            await loadItems();
            await loadGroup();
            setFocusId(focusId);
        }
        setDeleteId(undefined)
    }

    const handleDeleteItemOnEmpty = async (id: number, focusId?: number) => {
        await deleteItem(id);
        await loadItems();
        await loadGroup();
        setDeleteId(undefined)
        if (focusId) {
            setFocusId(focusId);
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
        return items
            .filter(({ completed }) => {
                if (filter === 'completed') return completed;
                if (filter === 'pending') return !completed;
                return true; // 'all'
            })
            .map(({ completed, content, sortOrder, id }) => {
                return {
                    id: Number(id),
                    sortOrder,
                    value: content,
                    checked: completed
                }
            });
    }, [items, filter]);

    return (
        <>
            <NavBar
                onChangeFilter={setFilter}

                volumeSlider={{
                    value: localVolume,
                    onChange: (value) => { handleVolume(value) }
                }}

                volumeValue={(localVolume / 100) * 1}
                onClickBack={() => { navigate(`/`); }}
                confettiValue={showConfetti}
                onClickConfetti={handleConfetti}
                playWon={percentage == 100}
                onClickHotKeys={() => { setShowHotKeys(true) }}
            />
            <div className='relative  pt-2 pb-2 min-h-0 scroll-hidden overflow-auto' >
                {group &&
                    <TodoGroupCard
                        value={group.title ?? ''}
                        completed={group.completed}

                        onHitEnter={() => {
                            setShowNewLineToast(true);
                        }}

                        onChange={(value) => {
                            handleGroupCardChange(Number(groupId), value);
                        }}

                        total={group.total}
                        type='step'
                        readonly
                    />
                }
                <hr className='absolute opacity-60 bottom-0 left-0 right-0 m-auto w-[calc(100%-15px)] border-0 border-b-2 border-gray-200' />
            </div>
            <TodoItems
                data={mappedItems}
                volume={(localVolume / 100) * 1}

                onDelete={(id, focusId) => { handleDeleteItem(id, focusId) }}

                onChangeText={(id, value) => { handleUpdateContent(id, value) }}
                onClickCheck={(id, value) => { handleUpdateCompleted(id, value) }}
                onHitEnter={(sortOrder) => { setShowNewLineToast(true); handleCreateItem(sortOrder) }}
                onEmptyDelete={handleDeleteItemOnEmpty}
                onReorder={handleBulkReorder}
                isEmpty={items.length == 0}
                onCreateNew={() => { handleCreateItem() }}
                isLoading={isLoading}
                isReordering={isReorderingRef.current}
                onUp={(value) => { setFocusId(value) }}
                onDown={(value) => { setFocusId(value) }}
                deleteId={deleteId}

                focusId={typeof deleteId == 'number' ? undefined : focusId}
                onClickFocus={(id) => { setFocusId(id) }}
                onClearFocus={(id) => { id == focusId && setFocusId(undefined); }}
            />
            <AddNewButton
                type='task'
                onClick={() => { handleCreateItem() }}
            />
            {
                deleteId &&
                <DeleteAlertModal
                    onCancel={onCancel}
                    onDelete={onConfirm}
                    placeholder='Item'
                />
            }
            {
                (showConfetti && percentage == 100) &&
                <Confetti
                    className='h-full m-auto'
                    recycle={true}
                />
            }
            {
                showHotKeys &&
                <KeybindingTableModal
                    onClose={() => { setShowHotKeys(false) }}
                />
            }
            {
                showNewLineToast &&
                <NewlineToast onClose={() => { setShowNewLineToast(false) }} />
            }
        </>
    )
}

export default TodoItemsContainers

