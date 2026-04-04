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
  const [groups, items] = await Promise.all([
    db.todoGroups.toArray(),
    db.todoItems.toArray(),
  ]);

  const map = new Map<number, { total: number; completed: number }>();

  for (const item of items) {
    const stats = map.get(item.groupId) || { total: 0, completed: 0 };

    stats.total += 1;
    if (item.completed) stats.completed += 1;

    map.set(item.groupId, stats);
  }

  return groups.map((group) => {
    const stats = map.get(group.id!) || {
      total: 0,
      completed: 0,
    };

    return {
      ...group,
      total: stats.total,
      completed: stats.completed,
      pending: stats.total - stats.completed,
    };
  });
};
