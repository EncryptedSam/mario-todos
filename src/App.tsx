import { Route, Routes } from 'react-router-dom';
import TodoGroupsPage from './pages/TodoGroupsPage';
import TodoItemsPage from './pages/TodoItemsPage';

function App() {

  return (
    <Routes>
      <Route path="/" element={<TodoGroupsPage />} />
      <Route path="/group/:id/" element={<TodoItemsPage />} />
    </Routes>
  );
}

export default App


