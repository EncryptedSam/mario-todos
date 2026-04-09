import { db } from "../db";
import type { TodoGroupWithStats } from "../db/schema";

// CREATE
export const createGroup = async (
  title: string,
  sortOrder?: number
) => {
  const groups = await db.todoGroups.orderBy("sortOrder").toArray();

  // case 1: no groups
  if (groups.length === 0) {
    return db.todoGroups.add({ title, sortOrder: 1 });
  }

  // case 2: no sortOrder passed → append
  if (sortOrder === undefined) {
    const last = groups[groups.length - 1];
    return db.todoGroups.add({
      title,
      sortOrder: last.sortOrder + 1,
    });
  }

  // case 3: clamp sortOrder
  const maxOrder = groups[groups.length - 1].sortOrder;
  const newOrder = Math.min(sortOrder, maxOrder + 1);

  // case 4: shift affected groups
  await db.transaction("rw", db.todoGroups, async () => {
    for (const group of groups) {
      if (group.sortOrder >= newOrder) {
        await db.todoGroups.update(group.id!, {
          sortOrder: group.sortOrder + 1,
        });
      }
    }

    await db.todoGroups.add({
      title,
      sortOrder: newOrder,
    });
  });
};

// READ ALL (sorted)
export const getGroups = () => {
  return db.todoGroups.orderBy("sortOrder").toArray();
};

// READ BY ID
export const getGroupById = (id: number) => {
  return db.todoGroups.get(id);
};

// UPDATE
export const updateGroup = (id: number, title: string) => {
  return db.todoGroups.update(id, { title });
};

// UPDATE SORT ORDER
export const updateGroupOrder = (id: number, sortOrder: number) => {
  return db.todoGroups.update(id, { sortOrder });
};

// UPDATE SORT ORDER BULK
export const bulkUpdateGroupOrder = async (
  groups: { id: number; sortOrder: number }[]
) => {
  await db.transaction("rw", db.todoGroups, async () => {
    for (const group of groups) {
      await db.todoGroups.update(group.id, {
        sortOrder: group.sortOrder,
      });
    }
  });
};

// DELETE (with cascade)
export const deleteGroup = async (id: number) => {
  await db.todoItems.where("groupId").equals(id).delete();
  return db.todoGroups.delete(id);
};

// READ ONE WITH STATS
export const getGroupByIdWithStats = async (
  id: number,
): Promise<TodoGroupWithStats | undefined> => {
  const group = await db.todoGroups.get(id);
  if (!group) return;

  const items = await db.todoItems
    .where("[groupId+sortOrder]")
    .between([id, 0], [id, Infinity])
    .toArray();

  const total = items.length;
  const completed = items.reduce((acc, i) => acc + (i.completed ? 1 : 0), 0);
  const pending = total - completed;

  return {
    ...group,
    total,
    completed,
    pending,
  };
};

// READ ALL WITH STATS (sorted )
export const getGroupsWithStats = async (): Promise<TodoGroupWithStats[]> => {
  const [groups, items] = await Promise.all([
    db.todoGroups.orderBy("sortOrder").toArray(), // sorted
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
    const stats = group.id
      ? map.get(group.id) || { total: 0, completed: 0 }
      : { total: 0, completed: 0 };

    return {
      ...group,
      total: stats.total,
      completed: stats.completed,
      pending: stats.total - stats.completed,
    };
  });
};
