import { useEffect, useRef, useState } from 'react'
import coinSound from "./assets/sounds/mario_coin_sound.mp3";
import { RiDeleteBin2Line, RiEdit2Line, } from "react-icons/ri";
import { MdOutlineAddTask } from 'react-icons/md';
import { Route, Routes } from 'react-router-dom';
import TodoGroupsPage from './pages/TodoGroupsPage';
import TodoItemsPage from './pages/TodoItemsPage';
import hexWithAlpha from './utils/hexWithAlpha';


function App() {

  return (
    <Routes>
      <Route path="/" element={<TodoGroupsPage />} />
      <Route path="/group/:id/" element={<TodoItemsPage />} />
    </Routes>
  );

  return (
    <div
      className='w-screen h-screen flex justify-center items-center bg-gray-950'
      style={{
        backgroundImage: `
          repeating-linear-gradient(
            -45deg,
            ${hexWithAlpha('#f3f4f6', 0.04)} 0px,
            ${hexWithAlpha('#f3f4f6', 0.04)} 10px,
            ${hexWithAlpha('#111827', 0.04)} 10px,
            ${hexWithAlpha('#111827', 0.04)} 20px
          )
        `
      }}
    >
      <div className='relative pt-20! h-[calc(100vh-100px)] w-110 flex flex-col'>
        <div className='absolute w-full flex justify-center luckiest-guy-regular items-center top-0 z-10 text-gray-100 font-bold space-x-3! text-4xl'>
          <span className='self-start mt-10'>Lets</span>
          <div
            className='w-30 h-30 border-5 border-red-600 rounded-full bg-white bg-no-repeat bg-cover bg-center'
            style={{
              backgroundImage: "url('/mario.png')",
            }}
          />
          <span className='self-start mt-10'>Doo</span>
        </div>
        <div
          className='relative flex flex-col flex-1 border-5 border-red-600 rounded-2xl bg-repeat overflow-hidden'
          style={{
            background: "url('/bg-mario.png')",
            backgroundSize: '130px'
          }}
        >


          <div className='flex-1 min-h-0 p-8 pt-12! pb-0! overflow-auto space-y-2.5! scroll-hidden'>
            <TodoGroup />
            <TodoItem done />
            <TodoItem />
            <TodoItem />
            <TodoItem />
          </div>
          <div className='p-8 pb-5! pt-3!' >
            <button className='w-full py-2 inline-flex items-center justify-center space-x-2! text-sm font-medium bg-red-600 rounded-full text-gray-100 cursor-pointer' >
              <span>Add New Task</span>
              <MdOutlineAddTask className='text-[16px]' />
              {/* <AiOutlineContainer className='text-[16px]' /> */}
            </button>
          </div>

          {/* <div
          className='absolute border-5 border-gray-50 rounded-full -top-170 -left-45 w-200 h-200 overflow-hidden'
        >
          <div className='w-full h-full bg-green-400 opacity-70' />
        </div> */}
          <div className='absolute left-4 top-4 h-2.5 w-2.5 rounded-full bg-red-600' />
          <div className='absolute right-4 top-4 h-2.5 w-2.5 rounded-full bg-red-600' />
          <div className='absolute bottom-4 right-4 h-2.5 w-2.5 rounded-full bg-red-600' />
          <div className='absolute bottom-4 left-4 h-2.5 w-2.5 rounded-full bg-red-600' />
        </div>
      </div>
    </div>
  )
}

export default App





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

interface ButtonGroupProps {
  buttons?: { icon?: React.ReactNode, onClick?(): void }[]
  right?: number;
  top?: number;
}

const ButtonGroup = ({ right, top, buttons }: ButtonGroupProps) => {


  return (
    <div
      className='absolute hidden border border-gray-200 bg-gray-100 rounded-xl overflow-hidden group-hover:flex'
      style={{ right, top }}
    >
      {
        buttons?.map(({ icon, onClick }, idx) => {
          return (
            <button
              key={`${idx}`}
              className='inline-flex items-center justify-center h-5 w-8 border-0 border-r border-gray-200 last-of-type:border-0 cursor-pointer'
              onClick={onClick}
            >
              {icon}
            </button>
          )
        })
      }
    </div>
  )
}


interface TodoGroupProps {
  type?: 'progress' | 'step'
  readOnly?: boolean;
  percentage?: number
  dots?: number;
}


const TodoGroup = ({ percentage, dots, readOnly }: TodoGroupProps) => {
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const autoResize = () => {
    const el = textareaRef.current;
    if (!el) return;

    el.style.height = "auto";          // reset
    el.style.height = el.scrollHeight + "px"; // grow
  };

  const arr = Array.from({ length: dots ?? 5 });

  return (
    <div className='relative p-3 group rounded-2xl bg-gray-100 text-sm flex flex-col space-x-3! space-y-2! border border-gray-200' >
      {
        !readOnly &&
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
      }
      <div className='flex w-full text-sm font-medium'>
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
        <span className='inline-flex shrink-0 items-end w-10 justify-end'>100%</span>
      </div>

      <div className="relative w-full h-2 bg-gray-300 rounded overflow-hidden">
        <div
          className="h-full bg-blue-500 transition-all duration-300 rounded-full"
          style={{ width: `${percentage ?? 30}%` }}
        />
        <div className='absolute w-full h-full top-0 left-0 flex justify-between items-center' >
          {
            arr.map((_, idx) => {
              return (
                <div
                  key={`dot_${idx}`}
                  className='h-1.5 w-1.5 bg-gray-100 first-of-type:opacity-0 last-of-type:opacity-0 rounded-full'
                />
              )
            })
          }
        </div>
      </div>

    </div>
  )
}













/**
 * 

[x] height
[ ] button group
[ ] textarea (expandable)








Lorem, ipsum dolor sit amet consectetur adipisicing elit. Officia quasi voluptates dolorem amet cum? Impedit dicta tempora ipsam fugiat deleniti minus consequuntur culpa inventore! Saepe eaque eum quis voluptatibus a!

*/