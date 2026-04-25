import { useEffect, useMemo, useRef, useState } from 'react'
import NavBar from '../components/NavBar'
import AddNewButton from '../components/AddNewButton'
import { createGroup, getGroupsWithStats, updateGroup, deleteGroup, bulkUpdateGroupOrder } from '../services/todoGroup.service'
import type { TodoGroupWithStats } from '../db/schema'
import { useNavigate } from 'react-router-dom'
import { getVolume, setVolume } from '../services/settings.service'
import TodoGroups from '../components/TodoGroups'
import DeleteAlertModal from '../components/DeleteAlertModal'
import useEscape from '../hooks/useEscape'
import NewlineToast from '../components/NewlineToast'
import KeybindingTableModal from '../components/KeybindingTableModal'

const TodoGroupsContainers = () => {
    const [filter, setFilter] = useState<string>('all');
    const [deleteId, setDeleteId] = useState<number | undefined>(undefined);
    const [localVolume, setLocalVolume] = useState<number>(0);
    const [groups, setGroups] = useState<TodoGroupWithStats[]>([]);
    const [focusId, setFocusId] = useState<number | undefined>(undefined);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [showNewLineToast, setShowNewLineToast] = useState<boolean>(false);
    const [showHotKeys, setShowHotKeys] = useState<boolean>(false);
    const isCreatingRef = useRef<boolean>(false);
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
        }
    }

    const handleCardChange = async (id: number, value: string) => {
        await updateGroup(id, value);
        await loadRows();
    }

    const handleDeleteGroup = async () => {
        if (typeof deleteId == 'number') {
            await deleteGroup(deleteId);
            await loadRows();
            setDeleteId(undefined)
        }
    }

    const handleVolume = async (value: number) => {
        setLocalVolume(value);
        setVolume(value);
    }

    const handleDeleteItemOnEmpty = async (id: number, focusId?: number) => {
        await deleteGroup(id);
        await loadRows();
        setDeleteId(undefined)
        if (typeof focusId == 'number') {
            setFocusId(focusId);
        }
    }

    const handleBulkReorder = async (items: { id: number; sortOrder: number }[]) => {
        await bulkUpdateGroupOrder(items);
        await loadRows();
    }

    const filteredGroups: TodoGroupWithStats[] = useMemo(() => {
        return groups
            .filter(({ completed }) => {
                if (filter === 'completed') return completed;
                if (filter === 'pending') return !completed;
                return true;
            })
    }, [groups, filter]);

    return (
        < >
            <NavBar
                onChangeFilter={setFilter}
                volumeSlider={{
                    value: localVolume,
                    onChange: (value) => { handleVolume(value) }
                }}
            />
            
            <TodoGroups
                data={filteredGroups}
                onChange={(id, value) => { handleCardChange(Number(id), value) }}
                onDelete={(id) => { setDeleteId(Number(id)) }}
                onClick={(id) => { navigate(`/group/${id}/`); }}
                onHitEnter={(sortOrder) => { setShowNewLineToast(true); handleCreateGroup(sortOrder) }}
                onEmptyDelete={handleDeleteItemOnEmpty}
                onUp={(value) => { setFocusId(value) }}
                onDown={(value) => { setFocusId(value) }}
                onReorder={handleBulkReorder}
                isEmpty={groups.length == 0}
                onCreateNew={() => { handleCreateGroup() }}
                isLoading={isLoading}
                deleteId={deleteId}

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
                    onCancel={() => { setDeleteId(undefined) }}
                    onDelete={handleDeleteGroup}
                    placeholder='Group'
                />
            }
            {
                showNewLineToast &&
                <NewlineToast onClose={() => { setShowNewLineToast(false) }} />
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