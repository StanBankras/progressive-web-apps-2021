export function sortByDate(items: [], dateKey: string): any[] {
  return items.sort((a, b) => new Date(b[dateKey]).getTime() - new Date(a[dateKey]).getTime());
}

export function getLatestItemByDate(items: [], dateKey: string): any[] {
  return sortByDate(items, dateKey)[0];
}