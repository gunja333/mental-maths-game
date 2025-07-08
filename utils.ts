
// Returns date in YYYY-MM-DD format
export const getTodayDateString = (): string => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

// Checks if two YYYY-MM-DD date strings are for consecutive days
export const areDatesConsecutive = (dateStr1: string, dateStr2: string): boolean => {
  const date1 = new Date(dateStr1);
  const date2 = new Date(dateStr2);
  date1.setDate(date1.getDate() + 1);
  return date1.toISOString().split('T')[0] === date2.toISOString().split('T')[0];
};
