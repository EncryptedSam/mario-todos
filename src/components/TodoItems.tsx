import React, { useRef, useState } from 'react'
import coinSound from "../assets/sounds/mario_coin_sound.mp3";
import ButtonGroup from './ui/shared/ButtonGroup';
import { RiDeleteBin2Line, RiEdit2Line } from 'react-icons/ri';
import NavBar from './ui/NavBar';
import TodoGroupCard from './ui/TodoGroupCard';
import AddNewButton from './ui/AddNewButton';
import TodoItemCard from './ui/TodoItemCard';

interface Props {

}

const TodoItems = ({ }: Props) => {
  return (
    <>
      <NavBar />
      <div className='pt-2.5 space-y-2.5! min-h-0 scroll-hidden overflow-auto' >
        <TodoGroupCard />
      </div>
      <div className='flex-1 pt-2.5 space-y-2.5! min-h-0 scroll-hidden overflow-auto' >
        <TodoItemCard />
        <TodoItemCard />
        <TodoItemCard />
        <TodoItemCard />
        <TodoItemCard />
        <TodoItemCard />
        <TodoItemCard />
        <TodoItemCard />
        <TodoItemCard />
        <TodoItemCard />
        <TodoItemCard />
        <TodoItemCard />
        <TodoItemCard />
        <TodoItemCard />
      </div>
      <AddNewButton type='task' />
    </>
  )
};

export default TodoItems
