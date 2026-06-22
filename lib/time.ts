export function subDays(days: number, plusFraction = 0) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  if (plusFraction) {
    date.setHours(date.getHours() + plusFraction * 24);
  }

  return date;
}

export function subHours(hours: number) {
  const date = new Date();
  date.setHours(date.getHours() - hours);

  return date;
}
