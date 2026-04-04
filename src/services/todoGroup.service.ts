import { db } from "../db";
import type { TodoGroupWithStats } from "../db/schema";

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

export const getGroupByIdWithStats = async (
  id: number,
): Promise<TodoGroupWithStats | undefined> => {
  const group = await db.todoGroups.get(id);
  if (!group) return;

  const items = await db.todoItems.where("groupId").equals(id).toArray();

  const total = items.length;
  const completed = items.filter((i) => i.completed).length;
  const pending = total - completed;

  return {
    ...group,
    total,
    completed,
    pending,
  };
};

export const getGroupsWithStats = async (): Promise<TodoGroupWithStats[]> => {
  const groups = await db.todoGroups.toArray();

  const result: TodoGroupWithStats[] = [];

  for (const group of groups) {
    const items = await db.todoItems
      .where("groupId")
      .equals(group.id!)
      .toArray();

    const total = items.length;
    const completed = items.filter((i) => i.completed).length;
    const pending = total - completed;

    result.push({
      ...group,
      total,
      completed,
      pending,
    });
  }

  return result;
};
