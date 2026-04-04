import Dexie, { type Table } from "dexie";
import type { TodoGroup, TodoItem, Setting } from "./schema";

class AppDB extends Dexie {
  todoGroups!: Table<TodoGroup>;
  todoItems!: Table<TodoItem>;
  settings!: Table<Setting>;

  constructor() {
    super("TodoAppDB");

    this.version(1).stores({
      todoGroups: "++id, title",
      todoItems: "++id, groupId",
      settings: "key",
    });
  }
}

export const db = new AppDB();
