export interface TodoGroup {
  id?: number;
  title: string;
}

export interface TodoItem {
  id?: number;
  groupId: number;
  content: string;
}

export interface Setting {
  key: string;
  value: any;
}
