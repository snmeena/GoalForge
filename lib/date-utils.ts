/**
 * Returns the current date in YYYY-MM-DD format based on local time.
 */
export function getLocalDateString(date: Date = new Date()): string {
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - (offset * 60 * 1000));
  return localDate.toISOString().split('T')[0];
}

/**
 * Checks if a date string is "today" in local time.
 */
export function isToday(dateString: string): boolean {
  return dateString === getLocalDateString();
}
