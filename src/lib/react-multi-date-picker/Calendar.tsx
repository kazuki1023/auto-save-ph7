'use client';

import {
  Calendar as ReactMultiDatePickerCalendar,
  CalendarProps as ReactMultiDatePickerCalendarProps,
} from 'react-multi-date-picker';

import './calendar.css';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface CalendarProps extends ReactMultiDatePickerCalendarProps {}

const Calendar = (props: CalendarProps) => {
  return <ReactMultiDatePickerCalendar {...props} />;
};

export default Calendar;
