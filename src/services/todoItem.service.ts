import { db } from "../db";

export const createItem = async (
  groupId: number,
  content: string,
  sortOrder?: number,
) => {
  const items = await db.todoItems
    .where("[groupId+sortOrder]")
    .between([groupId, 0], [groupId, Infinity])
    .toArray();

  // case 1: no items in group
  if (items.length === 0) {
    return db.todoItems.add({
      groupId,
      content,
      completed: false,
      sortOrder: 1,
    });
  }

  // case 2: no sortOrder → append
  if (sortOrder === undefined) {
    const last = items[items.length - 1];
    return db.todoItems.add({
      groupId,
      content,
      completed: false,
      sortOrder: last.sortOrder + 1,
    });
  }

  // case 3: clamp
  const maxOrder = items[items.length - 1].sortOrder;
  const newOrder = Math.min(sortOrder, maxOrder + 1);

  // case 4: shift + insert
  await db.transaction("rw", db.todoItems, async () => {
    for (const item of items) {
      if (item.sortOrder >= newOrder) {
        await db.todoItems.update(item.id!, {
          sortOrder: item.sortOrder + 1,
        });
      }
    }

    await db.todoItems.add({
      groupId,
      content,
      completed: false,
      sortOrder: newOrder,
    });
  });
};

// READ BY GROUP (sorted)
export const getItemsByGroup = (groupId: number) => {
  return db.todoItems
    .where("[groupId+sortOrder]")
    .between([groupId, 0], [groupId, Infinity])
    .toArray();
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

// UPDATE SORT ORDER
export const updateItemOrder = (id: number, sortOrder: number) => {
  return db.todoItems.update(id, { sortOrder });
};

export const bulkUpdateItemOrder = async (
  items: { id: number; sortOrder: number }[],
) => {
  await db.transaction("rw", db.todoItems, async () => {
    for (const item of items) {
      await db.todoItems.update(item.id, {
        sortOrder: item.sortOrder,
      });
    }
  });
};

// DELETE
export const deleteItem = (id: number) => {
  return db.todoItems.delete(id);
};
