import {
  format,
  addDays,
  addMonths,
  addWeeks,
  startOfDay,
  endOfDay,
} from 'date-fns';

export const formatDate = (date: Date) => {
  return format(date, 'yyyy-MM-dd');
};

export const _addDays = (date: Date, days: number) => {
  return addDays(date, days);
};

export const _addWeeks = (date: Date, weeks: number) => {
  return addWeeks(date, weeks);
};

export const _addMonths = (date: Date, months: number) => {
  return addMonths(date, months);
};

export const getToday = () => {
  return new Date();
};

export const getDayRangeISO = (dateStr: string) => {
  const date = new Date(dateStr);
  return {
    timeMin: startOfDay(date).toISOString(),
    timeMax: endOfDay(date).toISOString(),
  };
};

export const getTimeMinISO = (dateStr: string) => {
  const date = new Date(dateStr);
  return startOfDay(date).toISOString();
};

export const getTimeMaxISO = (dateStr: string) => {
  const date = new Date(dateStr);
  return endOfDay(date).toISOString();
};
