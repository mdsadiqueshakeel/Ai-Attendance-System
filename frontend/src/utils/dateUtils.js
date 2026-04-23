// src/utils/dateUtils.js

export const toYMD = (date) => {
  if (!date) return '';
  const d = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) return '';
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const fromYMD = (dateString) => {
  if (!dateString) return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateString);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const d = new Date(year, month - 1, day);
  if (Number.isNaN(d.getTime())) return null;
  return d;
};

export const isValidYMD = (dateString) => {
  const d = fromYMD(dateString);
  return !!d && toYMD(d) === dateString;
};

export const getTodayYMD = () => toYMD(new Date());

export const getStartOfWeekYMD = (date) => {
  const d = date instanceof Date ? new Date(date) : new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  return toYMD(new Date(d.setDate(diff)));
};

export const getEndOfWeekYMD = (date) => {
  const d = date instanceof Date ? new Date(date) : new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + 7;
  return toYMD(new Date(d.setDate(diff)));
};

// Backwards-compatible aliases (existing imports)
export const formatDate = toYMD;
export const parseDate = fromYMD;
export const getTodayDate = getTodayYMD;
export const getStartOfWeek = getStartOfWeekYMD;
export const getEndOfWeek = getEndOfWeekYMD;
