import { db } from "../db";

// CREATE
export const createGroup = (title: string) => {
  return db.todoGroups.add({ title });
};

// READ ALL
export const getGroups = () => {
  return db.todoGroups.toArray();
};

// READ BY ID
export const getGroupById = (id: number) => {
  return db.todoGroups.get(id);
};

// UPDATE
export const updateGroup = (id: number, title: string) => {
  return db.todoGroups.update(id, { title });
};

// DELETE (with cascade)
export const deleteGroup = async (id: number) => {
  await db.todoItems.where("groupId").equals(id).delete();
  return db.todoGroups.delete(id);
};
