import { db } from "../db";

// CREATE
export const createItem = (groupId: number, content: string) => {
  return db.todoItems.add({ groupId, content, completed: false });
};

// READ BY GROUP
export const getItemsByGroup = (groupId: number) => {
  return db.todoItems.where("groupId").equals(groupId).toArray();
};

// READ BY ID
export const getItemById = (id: number) => {
  return db.todoItems.get(id);
};

// UPDATE CONTENT
export const updateItemContent = (id: number, content: string) => {
  return db.todoItems.update(id, { content });
};

// UPDATE COMPLETED
export const updateItemCompleted = (id: number, completed: boolean) => {
  return db.todoItems.update(id, { completed });
};

// DELETE
export const deleteItem = (id: number) => {
  return db.todoItems.delete(id);
};
