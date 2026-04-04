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

// UPDATE
export const updateItem = (id: number, content: string) => {
  return db.todoItems.update(id, { content });
};

// DELETE
export const deleteItem = (id: number) => {
  return db.todoItems.delete(id);
};

export const toggleItem = async (id: number) => {
  const item = await db.todoItems.get(id);
  if (!item) return;

  return db.todoItems.update(id, {
    completed: !item.completed,
  });
};
