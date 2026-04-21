type BaseType = { id: number; sortOrder: number };

function reorderByIndex<T extends BaseType>(
  array: T[],
  fromSortOrder: number,
  toSortOrder: number,
): BaseType[] {
  const sorted = [...array].sort((a, b) => a.sortOrder - b.sortOrder);

  const fromIndex = sorted.findIndex((i) => i.sortOrder === fromSortOrder);
  const toIndex = sorted.findIndex((i) => i.sortOrder === toSortOrder);

  if (fromIndex === -1 || toIndex === -1) return sorted;

  if (fromSortOrder > toSortOrder) {
    const range = sorted
      .slice()
      .filter(
        (item) =>
          item.sortOrder >= toSortOrder && item.sortOrder <= fromSortOrder,
      )
      .map((items) => ({ id: items.id, sortOrder: items.sortOrder }));

    let res: BaseType[] = [];

    for (let i = 0; i < range.length; i++) {
      if (range.length == i + 1) {
        res.push({ id: range[i].id, sortOrder: toSortOrder });
      } else {
        res.push({ id: range[i].id, sortOrder: range[i + 1].sortOrder });
      }
    }

    return res;
  }

  if (fromSortOrder < toSortOrder) {
    const range = sorted
      .slice()
      .filter(
        (item) =>
          item.sortOrder >= fromSortOrder && item.sortOrder <= toSortOrder,
      )
      .map((items) => ({ id: items.id, sortOrder: items.sortOrder }));

    let res: BaseType[] = [];
    for (let i = 0; i < range.length; i++) {
      if (i == 0) {
        res.push({ id: range[i].id, sortOrder: toSortOrder });
      } else {
        res.push({ id: range[i].id, sortOrder: range[i - 1].sortOrder });
      }
    }

    return res;
  }

  return sorted;
}

export default reorderByIndex;
