type BaseType = { id?: number; sortOrder: number };

function reorderByIndex<T extends BaseType>(
  array: T[],
  fromSortId: number,
  toSortId: number,
): BaseType[] {
  const sorted = [...array].sort((a, b) => a.sortOrder - b.sortOrder);

  const fromIndex = sorted.findIndex((i) => i.sortOrder === fromSortId);
  const toIndex = sorted.findIndex((i) => i.sortOrder === toSortId);

  if (fromIndex === -1 || toIndex === -1) return sorted;

  if (fromSortId > toSortId) {
    const range = sorted
      .slice()
      .filter(
        (item) => item.sortOrder >= toSortId && item.sortOrder <= fromSortId,
      )
      .map((items) => ({ id: items.id, sortOrder: items.sortOrder }));

    let res: BaseType[] = [];

    for (let i = 0; i < range.length; i++) {
      if (range.length == i + 1) {
        res.push({ id: range[i].id, sortOrder: toSortId });
      } else {
        res.push({ id: range[i].id, sortOrder: range[i + 1].sortOrder });
      }
    }

    return res;
  }

  if (fromSortId < toSortId) {
    const range = sorted
      .slice()
      .filter(
        (item) => item.sortOrder >= fromSortId && item.sortOrder <= toSortId,
      )
      .map((items) => ({ id: items.id, sortOrder: items.sortOrder }));

    let res: BaseType[] = [];
    for (let i = 0; i < range.length; i++) {
      if (i == 0) {
        res.push({ id: range[i].id, sortOrder: toSortId });
      } else {
        res.push({ id: range[i].id, sortOrder: range[i - 1].sortOrder });
      }
    }

    return res;
  }

  return sorted;
}

export default reorderByIndex;