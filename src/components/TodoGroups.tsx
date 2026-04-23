import React, { useEffect, useRef, useState } from 'react'
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
}

const TodoGroups = ({ data, onChange, onDelete, onClick, onHitEnter, onEmptyDelete, focusId }: Props) => {
    const [groups, setGroups] = useState(data);
    const [focusGroupId, setFocusGroupId] = useState<number | undefined>(undefined);

    useEffect(() => {
        setGroups(data);
    }, [data])

    useEffect(() => {
        setFocusGroupId(undefined);
    }, [focusId])


    return (
        <div className='flex-1 pt-2.5 space-y-2.5! min-h-0 scroll-hidden overflow-auto scroll-smooth' >
            {
                groups?.map(({ id, title, completed, total, sortOrder }, idx) => {

                    let prevFocusId: number | undefined;
                    let nextFocusId: number | undefined;

                    if (groups.length > 0) {
                        // prev
                        if (idx > 0) {
                            prevFocusId = groups[idx - 1].id;
                        } else {
                            prevFocusId = groups[0].id;
                        }

                        // next
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
                            focus={focusId == id || focusGroupId == id}

                            onEmptyDelete={() => { onEmptyDelete?.(Number(id), prevFocusId) }}
                            onChange={(value) => { onChange?.(Number(id), value) }}
                            onDelete={() => { onDelete?.(Number(id)) }}
                            onClick={() => { onClick?.(Number(id)) }}
                            onHitEnter={() => { onHitEnter(sortOrder + 1) }}

                            onUp={() => { setFocusGroupId(prevFocusId) }}
                            onDown={() => { setFocusGroupId(nextFocusId) }}
                        />
                    )
                })
            }
        </div>
    )
}

export default TodoGroups