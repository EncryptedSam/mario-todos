import { Route, Routes } from 'react-router-dom';
import TodoGroupsPage from './pages/TodoGroupsPage';
import TodoItemsPage from './pages/TodoItemsPage';
import { useSounds } from './hooks/useSounds';
import { useEffect } from 'react';
// import { useEffect } from 'react';
// import { resetDB } from './db/utils';
// import ReorderList from './ReorderList';

// useEffect(() => {
//   const init = async () => {
//     await resetDB();
//   };

//   init();
// }, []);


function App() {
  const { play, stop, setVolume } = useSounds();

  useEffect(() => {

    setVolume(1);

  }, [])

  return (
    <div className='w-screen h-screen flex items-center justify-center space-x-2' >
      <Button
        label='Play'
        onClick={() => { play('taskswon') }}
      />
      <Button
        label='Stop'
        onClick={() => { stop('taskswon') }}
      />
    </div>
  )

  return (
    <Routes>
      <Route path="/" element={<TodoGroupsPage />} />
      <Route path="/group/:id/" element={<TodoItemsPage />} />
    </Routes>
  );
}

export default App



type ButtonProps = {
  label: string;
  onClick?: () => void;
  className?: string;
};

const Button = ({ label, onClick, className = "" }: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`bg-gray-100 py-0.5 px-2 rounded-lg cursor-pointer ${className}`}
    >
      {label}
    </button>
  );
};
