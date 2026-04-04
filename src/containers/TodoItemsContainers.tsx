import React, { useEffect, useState } from 'react'
import NavBar from '../components/ui/NavBar'
import TodoGroupCard from '../components/ui/TodoGroupCard'
import TodoItemCard from '../components/ui/TodoItemCard'
import AddNewButton from '../components/ui/AddNewButton'
import { useNavigate } from 'react-router-dom'
import { getGroupByIdWithStats } from '../services/todoGroup.service'
import { useParams } from "react-router-dom";
import type { TodoGroupWithStats } from '../db/schema'

const TodoItemsContainers = () => {
    const navigate = useNavigate();
    const { id: groupId } = useParams();

    const [filter, setFilter] = useState<string>('all');
    const [volume, setVolume] = useState<number>(10);

    const [group, setGroup] = useState<TodoGroupWithStats>();


    const loadGroup = async () => {
        const rows = await getGroupByIdWithStats(Number(groupId));
        setGroup(rows);
    }

    useEffect(() => {
        loadGroup();
    }, [])


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
                    value: volume,
                    onChange: setVolume
                }}

                onClickBack={() => { navigate(`/`); }}
            />
            <div className='pt-2.5 space-y-2.5! min-h-0 scroll-hidden overflow-auto' >
                <TodoGroupCard
                    value={group?.title ?? ''}
                    percentage={percentage}
                    readOnly
                />
            </div>
            <div className='flex-1 pt-2.5 space-y-2.5! min-h-0 scroll-hidden overflow-auto' >
                <TodoItemCard value='' />
                <TodoItemCard value='' />
                <TodoItemCard value='' />
                <TodoItemCard value='' />
                <TodoItemCard value='' />
                <TodoItemCard value='' />
                <TodoItemCard value='' />
                <TodoItemCard value='' />
                <TodoItemCard value='' />
                <TodoItemCard value='' />
                <TodoItemCard value='' />
                <TodoItemCard value='' />
                <TodoItemCard value='' />
                <TodoItemCard value='' />
            </div>
            <AddNewButton type='task' />
        </>
    )
}

export default TodoItemsContainers