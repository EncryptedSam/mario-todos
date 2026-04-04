import React, { useEffect, useState } from 'react'
import NavBar from '../components/ui/NavBar'
import TodoGroupCard from '../components/ui/TodoGroupCard'
import AddNewButton from '../components/ui/AddNewButton'
import { createGroup, getGroupsWithStats, updateGroup, deleteGroup } from '../services/todoGroup.service'
import type { TodoGroupWithStats } from '../db/schema'
import { useNavigate } from 'react-router-dom'

const TodoGroupsContainers = () => {
    const [filter, setFilter] = useState<string>('all');
    const [volume, setVolume] = useState<number>(10);
    const [groups, setGroups] = useState<TodoGroupWithStats[]>([]);
    const navigate = useNavigate();


    const loadRows = async () => {
        const rows = await getGroupsWithStats();
        setGroups(rows);
    }

    const handleCreateGroup = async () => {
        await createGroup('');
        await loadRows();
    }

    useEffect(() => {
        loadRows();
    }, [])

    const handleCardChange = async (id: number, value: string) => {
        await updateGroup(id, value);
        await loadRows();
    }

    const handleDelete = async (id: number) => {
        await deleteGroup(id);
        await loadRows();
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
                    value: volume,
                    onChange: setVolume
                }}
            />
            <div className='flex-1 pt-2.5 space-y-2.5! min-h-0 scroll-hidden overflow-auto' >
                {
                    groups.map(({ id, title, completed, total }) => {

                        let percentage = (completed / total) * 100;
                        if (total == 0) {
                            percentage = 0;
                        }

                        return (
                            <TodoGroupCard
                                key={`todo_group_${id}`}
                                onChange={(value) => { handleCardChange(Number(id), value) }}
                                value={title}
                                onDelete={() => { handleDelete(Number(id)) }}
                                percentage={percentage}
                                onClick={() => { navigate(`/group/${id}/`); }}
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