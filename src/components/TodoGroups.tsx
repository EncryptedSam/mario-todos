import React, { useEffect, useState } from 'react'
import TodoGroupCard from './TodoGroupCard';
import type { TodoGroupWithStats } from '../db/schema';



interface Props {
    data?: TodoGroupWithStats[];

    focusId?: number;
    onChange?(groupId: number, value: string): void;
    onDelete?(groupId: number): void;
    onClick?(groupId: number): void;
    onHitEnter: (sortOrder: number) => void;

}


const TodoGroups = ({ data, onChange, onDelete, onClick, onHitEnter, focusId }: Props) => {
    const [groups, setGroups] = useState(data);


    useEffect(() => {
        setGroups(data);
    }, [data])


    return (
        <div className='flex-1 pt-2.5 space-y-2.5! min-h-0 scroll-hidden overflow-auto scroll-smooth' >
            {
                groups?.map(({ id, title, completed, total, sortOrder }) => {

                    return (
                        <TodoGroupCard
                            key={`todo_group_${id}`}
                            value={title}
                            completed={completed}
                            total={total}
                            focus={focusId == id}

                            onChange={(value) => { onChange?.(Number(id), value) }}
                            onDelete={() => { onDelete?.(Number(id)) }}
                            onClick={() => { onClick?.(Number(id)) }}
                            onHitEnter={() => { onHitEnter(sortOrder + 1) }}
                        />
                    )
                })
            }
        </div>
    )
}

export default TodoGroups