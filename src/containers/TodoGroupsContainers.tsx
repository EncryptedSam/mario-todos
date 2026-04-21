import { useEffect, useState } from 'react'
import NavBar from '../components/NavBar'
import TodoGroupCard from '../components/TodoGroupCard'
import AddNewButton from '../components/AddNewButton'
import { createGroup, getGroupsWithStats, updateGroup, deleteGroup } from '../services/todoGroup.service'
import type { TodoGroupWithStats } from '../db/schema'
import { useNavigate } from 'react-router-dom'
import { getVolume, setVolume } from '../services/settings.service'

const TodoGroupsContainers = () => {
    const [filter, setFilter] = useState<string>('all');
    const [localVolume, setLocalVolume] = useState<number>(0);
    const [groups, setGroups] = useState<TodoGroupWithStats[]>([]);
    const navigate = useNavigate();

    const loadRows = async () => {
        const rows = await getGroupsWithStats();
        setGroups(rows);
    }

    const loadVolume = async () => {
        const volume = await getVolume();
        setLocalVolume(volume);
    }

    const handleCreateGroup = async () => {
        await createGroup('');
        await loadRows();
    }

    useEffect(() => {
        loadRows();
        loadVolume();
    }, [])

    const handleCardChange = async (id: number, value: string) => {
        await updateGroup(id, value);
        await loadRows();
    }

    const handleDelete = async (id: number) => {
        await deleteGroup(id);
        await loadRows();
    }

    const handleVolume = async (value: number) => {
        setLocalVolume(value);
        setVolume(value);
    }

    return (
        < >
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
            />
            <div className='flex-1 pt-2.5 space-y-2.5! min-h-0 scroll-hidden overflow-auto' >
                {
                    groups.map(({ id, title, completed, total }, idx) => {

                        return (
                            <TodoGroupCard
                                key={`todo_group_${id}`}
                                onChange={(value) => { handleCardChange(Number(id), value) }}
                                value={title}
                                onDelete={() => { handleDelete(Number(id)) }}
                                onClick={() => { navigate(`/group/${id}/`); }}
                                completed={completed}
                                total={total}
                            />
                        )
                    })
                }
            </div>
            <AddNewButton
                type='group'
                onClick={handleCreateGroup}
            />
        </>
    )
}

export default TodoGroupsContainers