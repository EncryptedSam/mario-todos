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
    onEmptyDelete?: (itemId: number, focusId?: number) => void;
    onUp?: (focusGroupId?: number) => void;
    onDown?: (focusGroupId?: number) => void;
}

const TodoGroups = ({ data, onChange, onDelete, onClick, onHitEnter, onEmptyDelete, focusId, onUp, onDown }: Props) => {
    const [groups, setGroups] = useState(data);

    useEffect(() => {
        setGroups(data);
    }, [data])


    return (
        <div className='flex-1 pt-2.5 space-y-2.5! min-h-0 scroll-hidden overflow-auto scroll-smooth' >
            {
                groups?.map(({ id, title, completed, total, sortOrder }, idx) => {

                    let prevFocusId: number | undefined;
                    let nextFocusId: number | undefined;

                    if (groups.length > 0) {
                        if (idx > 0) {
                            prevFocusId = groups[idx - 1].id;
                        } else {
                            prevFocusId = groups[0].id;
                        }

                        if (idx < groups.length - 1) {
                            nextFocusId = groups[idx + 1].id;
                        } else {
                            nextFocusId = groups[idx].id;
                        }
                    }

                    return (
                        <TodoGroupCard
                            key={`todo_group_${id}_${sortOrder}`}
                            value={title}
                            completed={completed}
                            total={total}
                            focus={focusId == id}

                            onEmptyDelete={() => { onEmptyDelete?.(Number(id), prevFocusId) }}
                            onChange={(value) => { onChange?.(Number(id), value) }}
                            onDelete={() => { onDelete?.(Number(id)) }}
                            onClick={() => { onClick?.(Number(id)) }}
                            onHitEnter={() => { onHitEnter(sortOrder + 1) }}

                            onUp={() => { onUp?.(prevFocusId) }}
                            onDown={() => { onDown?.(nextFocusId) }}
                        />
                    )
                })
            }
        </div>
    )
}

export default TodoGroups