import { useEffect, useMemo, useRef, useState } from 'react'
import AddNewButton from '../components/AddNewButton'
import { createGroup, getGroupsWithStats, updateGroup, deleteGroup, bulkUpdateGroupOrder } from '../services/todoGroup.service'
import type { TodoGroupWithStats } from '../db/schema'
import { useNavigate } from 'react-router-dom'
import { getVolume, setConfetti, setVolume as setVolumeDb } from '../services/settings.service'
import TodoGroups from '../components/TodoGroups'
import DeleteAlertModal from '../components/DeleteAlertModal'
import useEscape from '../hooks/useEscape'
import NewlineToast from '../components/NewlineToast'
import KeybindingTableModal from '../components/KeybindingTableModal'
import ReactConfetti from 'react-confetti'
import useConfirmResolver from '../hooks/useConfirmResolver'
import NavBar from '../components/NavBar'
import useAltN from '../hooks/useAltN'
import { useSounds } from '../hooks/useSounds'

const areAllGroupsCompleted = (groups: TodoGroupWithStats[]) => {
    if (groups.length == 0) return false;
    return groups.every(group => {
        if (group.total === 0) return false;
        return group.completed === group.total;
    });
};

const TodoGroupsContainers = () => {
    const [filter, setFilter] = useState<string>('all');
    const [deleteId, setDeleteId] = useState<number | undefined>(undefined);
    const [localVolume, setLocalVolume] = useState<number>(0);
    const [groups, setGroups] = useState<TodoGroupWithStats[]>([]);
    const [focusId, setFocusId] = useState<number | undefined>(undefined);
    const [showConfetti, setShowConfetti] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [showNewLineToast, setShowNewLineToast] = useState<boolean>(false);
    const [showHotKeys, setShowHotKeys] = useState<boolean>(false);
    const isCreatingRef = useRef<boolean>(false);
    const isReorderingRef = useRef<boolean>(false);
    const { onConfirm, onCancel, confirm } = useConfirmResolver();
    const { play, stop, setVolume } = useSounds();
    const navigate = useNavigate();

    useEscape(() => {
        setDeleteId(undefined);
        setFocusId(undefined);
    });


    const loadRows = async () => {
        const rows = await getGroupsWithStats();
        setGroups(rows);
    }

    const loadVolume = async () => {
        const volume = await getVolume();
        setLocalVolume(volume);
    }

    useEffect(() => {
        (async () => {
            await loadRows();
            await loadVolume();
            setIsLoading(false);
        })()
    }, [])

    const handleCreateGroup = async (sortOrder?: number) => {
        setFilter('all');
        if (isCreatingRef.current == false) {
            isCreatingRef.current = true;
            const id = await createGroup('', sortOrder);
            await loadRows();
            if (typeof id == 'number') {
                setFocusId(id);
            }
            isCreatingRef.current = false;
            play('newtask')
        }
    }

    const handleCardChange = async (id: number, value: string) => {
        await updateGroup(id, value);
        await loadRows();
    }

    const handleDeleteGroup = async (groupId: number, focusId?: number) => {
        setDeleteId(groupId);
        let ok = await confirm();

        if (ok) {
            await deleteGroup(groupId);
            await loadRows();
            setFocusId(focusId);
            play('stomp');
        }
        setDeleteId(undefined)
    }

    const handleVolume = async (value: number) => {
        setLocalVolume(value);
        setVolumeDb(value);
    }

    const handleBulkReorder = async (items: { id: number; sortOrder: number }[]) => {

        if (isReorderingRef.current == false) {
            isReorderingRef.current = true;
            await bulkUpdateGroupOrder(items);
            await loadRows();
            isReorderingRef.current = false;
        }

    }

    const handleConfetti = async () => {
        setShowConfetti(!showConfetti);
        setConfetti(!showConfetti);
    }

    useAltN(() => {
        handleCreateGroup();
    });

    const filteredGroups: TodoGroupWithStats[] = useMemo(() => {
        return groups
            .filter(({ completed }) => {
                if (filter === 'completed') return completed;
                if (filter === 'pending') return !completed;
                return true;
            })
    }, [groups, filter]);

    const allGroupsCompleted = areAllGroupsCompleted(groups);

    useEffect(() => {
        if (typeof localVolume == 'number') {
            setVolume((localVolume / 100) * 1);
        }
    }, [localVolume])

    useEffect(() => {
        if (allGroupsCompleted) {
            play('groupswon')
        }

        if (!allGroupsCompleted) {
            stop('groupswon')
        }

        return () => {
            stop('groupswon')
        }
    }, [allGroupsCompleted])

    return (
        < >
            <NavBar
                onChangeFilter={setFilter}

                volumeValue={localVolume}
                onChangeVolume={handleVolume}

                confettiValue={showConfetti}
                onClickConfetti={handleConfetti}
                onClickHotKeys={() => { setShowHotKeys(true) }}
            />

            <TodoGroups
                data={filteredGroups}
                onChange={(id, value) => { handleCardChange(Number(id), value) }}

                onDelete={(id, focusId) => { handleDeleteGroup(id, focusId) }}
                onClick={(id) => { navigate(`/group/${id}/`); play('pipe'); }}
                onHitEnter={(sortOrder) => { setShowNewLineToast(true); handleCreateGroup(sortOrder) }}

                onUp={(value) => { setFocusId(value) }}
                onDown={(value) => { setFocusId(value) }}
                onReorder={handleBulkReorder}
                isEmpty={groups.length == 0}
                onCreateNew={() => { handleCreateGroup() }}
                isLoading={isLoading}
                deleteId={deleteId}
                isReordering={isReorderingRef.current}

                focusId={typeof deleteId == 'number' ? undefined : focusId}
                onClickFocus={(id) => { setFocusId(id) }}
                onClearFocus={(id) => { id == focusId && setFocusId(undefined); }}
            />
            <AddNewButton
                type='group'
                onClick={() => { handleCreateGroup() }}
            />
            {
                deleteId &&
                <DeleteAlertModal
                    onCancel={onCancel}
                    onDelete={onConfirm}
                    placeholder='Group'
                />
            }
            {
                showNewLineToast &&
                <NewlineToast onClose={() => { setShowNewLineToast(false) }} />
            }
            {
                (showConfetti && allGroupsCompleted && groups.length > 0) &&
                <ReactConfetti
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
        </>
    )
}

export default TodoGroupsContainers