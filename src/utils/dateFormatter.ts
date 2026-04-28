/**
 * Format date to DD-MMM-YYYY format (e.g., 28-Apr-2026)
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const day = String(d.getDate()).padStart(2, '0');
  const month = months[d.getMonth()];
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}

/**
 * Format date and time to DD-MMM-YYYY HH:MM format (e.g., 28-Apr-2026 14:30)
 */
export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const dateStr = formatDate(d);
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${dateStr} ${hours}:${minutes}`;
}

/**
 * Get current date in DD-MMM-YYYY format
 */
export function getCurrentDate(): string {
  return formatDate(new Date());
}

/**
 * Get current date and time in DD-MMM-YYYY HH:MM format
 */
export function getCurrentDateTime(): string {
  return formatDateTime(new Date());
}
