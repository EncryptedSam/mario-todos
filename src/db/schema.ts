export interface TodoGroup {
  id?: number;
  title: string;
  sortOrder: number;
}

export interface TodoGroupWithStats {
  id?: number;
  title: string;
  total: number;
  completed: number;
  pending: number;
  sortOrder: number;
}

export interface TodoItem {
  id?: number;
  groupId: number;
  content: string;
  completed: boolean;
  sortOrder: number;
}

export interface Setting {
  key: string;
  value: any;
}