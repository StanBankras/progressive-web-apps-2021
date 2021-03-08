export function sortByDate(items, dateKey) {
  return items.sort((a, b) => new Date(b[dateKey]).getTime() - new Date(a[dateKey]).getTime())
}

export function getLatestItemByDate(items, dateKey) {
  return sortByDate(items, dateKey)[0];
}