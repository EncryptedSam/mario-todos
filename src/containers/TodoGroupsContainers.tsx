import { useEffect, useMemo, useRef, useState } from 'react'
import NavBar from '../components/NavBar'
import TodoGroupCard from '../components/TodoGroupCard'
import AddNewButton from '../components/AddNewButton'
import { createGroup, getGroupsWithStats, updateGroup, deleteGroup } from '../services/todoGroup.service'
import type { TodoGroupWithStats } from '../db/schema'
import { useNavigate } from 'react-router-dom'
import { getVolume, setVolume } from '../services/settings.service'
import TodoGroups from '../components/TodoGroups'
import DeleteAlertModal from '../components/DeleteAlertModal'
import useEscape from '../hooks/useEscape'

const TodoGroupsContainers = () => {
    const [filter, setFilter] = useState<string>('all');
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [localVolume, setLocalVolume] = useState<number>(0);
    const [groups, setGroups] = useState<TodoGroupWithStats[]>([]);
    const [focusId, setFocusId] = useState<number | undefined>(undefined);
    const focusIdTimeoutRef = useRef<number | undefined>(undefined);
    const navigate = useNavigate();

    useEscape(() => {
        setDeleteId(null);
    });

    const loadRows = async () => {
        const rows = await getGroupsWithStats();
        setGroups(rows);
    }

    const loadVolume = async () => {
        const volume = await getVolume();
        setLocalVolume(volume);
    }

    const handleCreateGroup = async (sortOrder?: number) => {
        setFilter('all');

        const id = await createGroup('', sortOrder);
        await loadRows();
        setFocusId(id);

        clearTimeout(focusIdTimeoutRef.current);

        focusIdTimeoutRef.current = setTimeout(() => {
            setFocusId(undefined);
        }, 200)
    }

    useEffect(() => {
        loadRows();
        loadVolume();
    }, [])

    const handleCardChange = async (id: number, value: string) => {
        await updateGroup(id, value);
        await loadRows();
    }

    const handleDeleteGroup = async () => {
        if (typeof deleteId == 'number') {
            await deleteGroup(deleteId);
            await loadRows();
            setDeleteId(null)
        }
    }

    const handleVolume = async (value: number) => {
        setLocalVolume(value);
        setVolume(value);
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
                focusId={focusId}
                onChange={(id, value) => { handleCardChange(Number(id), value) }}
                onDelete={(id) => { setDeleteId(Number(id)) }}
                onClick={(id) => { navigate(`/group/${id}/`); }}
                onHitEnter={(sortOrder) => { handleCreateGroup(sortOrder) }}

            />
            <AddNewButton
                type='group'
                onClick={handleCreateGroup}
            />
            {
                deleteId &&
                <DeleteAlertModal
                    onCancel={() => { setDeleteId(null) }}
                    onDelete={handleDeleteGroup}
                    placeholder='Group'
                />
            }
        </>
    )
}

export default TodoGroupsContainers