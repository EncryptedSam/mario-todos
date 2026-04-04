import React, { useRef, useState } from 'react'
import coinSound from "../assets/sounds/mario_coin_sound.mp3";
import ButtonGroup from './ui/shared/ButtonGroup';
import { RiDeleteBin2Line, RiEdit2Line } from 'react-icons/ri';

interface TodoItemProps {
  done?: boolean
}

const TodoItem = ({ done }: TodoItemProps) => {
  const [completed, setCompleted] = useState(done);
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const handleClick = () => {
    setCompleted((prev) => {
      if (!prev) {
        const audio = new Audio(coinSound);
        audio.volume = 0.3;
        audio.play();
      }
      return !prev;
    });
  };

  const autoResize = () => {
    const el = textareaRef.current;
    if (!el) return;

    el.style.height = "auto";          // reset
    el.style.height = el.scrollHeight + "px"; // grow
  };

  return (
    <div className='relative p-3 group rounded-2xl bg-gray-100 text-sm flex space-x-3! border border-gray-200'>
      <ButtonGroup
        buttons={[
          {
            icon: <RiEdit2Line className='text-gray-700' />
          },
          {
            icon: <RiDeleteBin2Line className='text-red-500' />
          }
        ]}
        top={-10}
        right={0}
      />

      {completed ? (
        <div
          className='shrink-0 w-5 h-5 bg-no-repeat bg-cover bg-center cursor-pointer mario-hit'
          onClick={handleClick}
          style={{
            backgroundImage: "url('/coin.gif')",
            backgroundSize: '30px'
          }}
        />
      ) : (
        <div
          className='shrink-0 w-5 h-5 border border-gray-400 rounded-full cursor-pointer'
          onClick={handleClick}
        />
      )}

      <textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          autoResize();
        }}
        rows={1}
        placeholder="Untitled"
        className='flex-1 resize-none overflow-hidden bg-transparent outline-none'
      />
    </div>
  );
};

export default TodoItem
