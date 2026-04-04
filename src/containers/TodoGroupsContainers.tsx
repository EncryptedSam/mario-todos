import React, { useEffect, useState } from 'react'
import NavBar from '../components/ui/NavBar'
import TodoGroupCard from '../components/ui/TodoGroupCard'
import AddNewButton from '../components/ui/AddNewButton'
import { createGroup, getGroups, updateGroup, deleteGroup } from '../services/todoGroup.service'
import type { TodoGroup } from '../db/schema'

const TodoGroupsContainers = () => {
    const [filter, setFilter] = useState<string>('all');
    const [volume, setVolume] = useState<number>(10);
    const [groups, setGroups] = useState<TodoGroup[]>([]);

    const loadRows = async () => {
        const rows = await getGroups();
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
                    groups.map(({ id, title }) => {
                        return (
                            <TodoGroupCard
                                key={`todo_group_${id}`}
                                onChange={(value) => { handleCardChange(Number(id), value) }}
                                value={title}
                                onDelete={() => { handleDelete(Number(id)) }}
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