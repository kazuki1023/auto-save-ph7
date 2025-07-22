'use client';

import { useState } from 'react';
import {
  DateObject,
  Calendar as ReactMultiDatePickerCalendar,
} from 'react-multi-date-picker';

const Calendar = () => {
  const [value, setValue] = useState<DateObject | null>(null);
  return <ReactMultiDatePickerCalendar value={value} onChange={setValue} />;
};

export default Calendar;
