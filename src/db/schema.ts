export interface TodoGroup {
  id?: number;
  title: string;
}
export interface TodoGroupWithStats {
  id?: number;
  title: string;
  total: number;
  completed: number;
  pending: number;
}

export interface TodoItem {
  id?: number;
  groupId: number;
  content: string;
  completed: boolean; 
}

export interface Setting {
  key: string;
  value: any;
}
