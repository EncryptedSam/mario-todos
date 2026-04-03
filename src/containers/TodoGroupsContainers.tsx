import React from 'react'
import AddNewButton from '../components/ui/AddNewButton'
import TodoGroupCard from '../components/ui/TodoGroupCard'
import NavBar from '../components/ui/NavBar'

const TodoGroupsContainers = () => {
    return (
        <div className='flex flex-col w-full h-full px-3' >
            <NavBar />
            <div className='flex-1 pt-2.5 space-y-2.5! min-h-0 scroll-hidden overflow-auto' >
                <TodoGroupCard />
                <TodoGroupCard />
                <TodoGroupCard />
                <TodoGroupCard />
                <TodoGroupCard />
                <TodoGroupCard />
                <TodoGroupCard />
                <TodoGroupCard />
                <TodoGroupCard />
                <TodoGroupCard />
                <TodoGroupCard />
                <TodoGroupCard />
                <TodoGroupCard />
                <TodoGroupCard />
                <TodoGroupCard />
                <TodoGroupCard />
                <TodoGroupCard />
                <TodoGroupCard />
                <TodoGroupCard />
            </div>
            <AddNewButton className='py-2' type='group'  />
        </div>
    )
}

export default TodoGroupsContainers