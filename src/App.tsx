import { Route, Routes } from 'react-router-dom';
import TodoGroupsPage from './pages/TodoGroupsPage';
import TodoItemsPage from './pages/TodoItemsPage';
import { useEffect } from 'react';
import { resetDB } from './db/utils';


function App() {

  // useEffect(() => {
  //   const init = async () => {
  //     await resetDB();
  //   };

  //   init();
  // }, []);

  return (
    <Routes>
      <Route path="/" element={<TodoGroupsPage />} />
      <Route path="/group/:id/" element={<TodoItemsPage />} />
    </Routes>
  );
}

export default App