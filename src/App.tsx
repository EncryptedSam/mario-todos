import { Route, Routes } from 'react-router-dom';
import TodoGroupsPage from './pages/TodoGroupsPage';
import TodoItemsPage from './pages/TodoItemsPage';
// import { useSounds } from './hooks/useSounds';
// import { useEffect } from 'react';
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

  return (
    <Routes>
      <Route path="/" element={<TodoGroupsPage />} />
      <Route path="/group/:id/" element={<TodoItemsPage />} />
    </Routes>
  );
}

export default App

