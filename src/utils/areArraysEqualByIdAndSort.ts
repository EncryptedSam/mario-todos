type WithIdAndSort = {
  id?: number;
  sortOrder: number;
};

export default function areArraysEqualByIdAndSort<T extends WithIdAndSort>(
  a: T[],
  b: T[],
): boolean {
  if (a.length !== b.length) return false;

  const map = new Map<number, number>();

  for (const item of a) {
    if (item.id == null) return false;
    map.set(item.id, item.sortOrder);
  }

  for (const item of b) {
    if (item.id == null) return false;
    if (!map.has(item.id)) return false;
    if (map.get(item.id) !== item.sortOrder) return false;
  }

  return true;
}
