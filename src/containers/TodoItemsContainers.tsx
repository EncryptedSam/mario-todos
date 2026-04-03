import React from 'react'
import NavBar from '../components/ui/NavBar'
import AddNewButton from '../components/ui/AddNewButton'
import TodoItem from '../components/TodoItems'
import TodoGroupCard from '../components/ui/TodoGroupCard'

const TodoItemsContainers = () => {
    return (
        <>
            <NavBar />
            <div className='pt-2.5 space-y-2.5! min-h-0 scroll-hidden overflow-auto' >
                <TodoGroupCard />
            </div>
            <div className='flex-1 pt-2.5 space-y-2.5! min-h-0 scroll-hidden overflow-auto' >
                <TodoItem />
                <TodoItem />
                <TodoItem />
                <TodoItem />
                <TodoItem />
                <TodoItem />
                <TodoItem />
                <TodoItem />
                <TodoItem />
                <TodoItem />
                <TodoItem />
                <TodoItem />
                <TodoItem />
                <TodoItem />
                <TodoItem />
                <TodoItem />
                <TodoItem />
                <TodoItem />
                <TodoItem />
                <TodoItem />
                <TodoItem />
                <TodoItem />
                <TodoItem />
            </div>
            <AddNewButton type='task' />
        </>
    )
}

export default TodoItemsContainers