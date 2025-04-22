import { format, addDays, addMonths, addWeeks } from "date-fns";

export const formatDate = (date: Date) => {
  return format(date, "yyyy-MM-dd");
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
