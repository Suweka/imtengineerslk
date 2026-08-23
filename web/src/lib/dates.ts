export function nextWorkingDays(count: number) {
  const days: { label: string; day: string; iso: string }[] = [];
  const cursor = new Date();
  cursor.setDate(cursor.getDate() + 1);
  while (days.length < count) {
    const dow = cursor.getDay();
    if (dow !== 0) {
      days.push({
        label: cursor.toLocaleDateString("en-US", { weekday: "short" }),
        day: cursor.toLocaleDateString("en-US", { day: "2-digit", month: "short" }),
        iso: cursor.toISOString().slice(0, 10),
      });
    }
    cursor.setDate(cursor.getDate() + 1);
  }
  return days;
}
