import { Route, Routes } from 'react-router-dom';
import TodoGroupsPage from './pages/TodoGroupsPage';
import TodoItemsPage from './pages/TodoItemsPage';
import { useEffect } from 'react';
import { resetDB } from './db/utils';
import ReorderList from './ReorderList';


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

// ------------------------------------------------------------------

type SV = {
  s: number;
  v: number;
};

type SVValue<T = {}> = SV & T;

interface SvSquareProps<T = {}> {
  values: SVValue<T>[];
  onChange?(index: number, value: SVValue<T>): void;
  onAdd?(value: SV): void;
  onDelete?(index: number, value: SVValue<T>): void;
  onSelect?(index: number, value: SVValue<T>): void;
}

const SvSquare = <T,>(props: SvSquareProps<T>) => {

  


  return <div>SvSquare</div>;
};

<SvSquare
  values={[{ s: 1, v: 2, id: 2, r: 3 }]}
  onChange={(idx, value) => { console.log(value.r) }}
/>



// ---------------------------------------------------------------------------


interface SvThumbProps {
  selected?: boolean;
  onSelect?(): void;
  value: SV;
  onChange?(value: SV): void;
}

const SvThumb = (props: SvThumbProps) => {
  return <div>SvThumb</div>;
};




