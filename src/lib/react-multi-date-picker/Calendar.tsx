'use client';

import { useState } from 'react';
import {
  DateObject,
  Calendar as ReactMultiDatePickerCalendar,
} from 'react-multi-date-picker';

interface CalendarProps {
  value?: DateObject | null;
  onChange?: (value: DateObject | null) => void;
  [key: string]: any; // Allow additional props
}

const Calendar: React.FC<CalendarProps> = ({ value, onChange, ...props }) => {
  const [internalValue, setInternalValue] = useState<DateObject | null>(null);
  const handleChange = (val: DateObject | null) => {
    setInternalValue(val);
    if (onChange) onChange(val);
  };

  return (
    <ReactMultiDatePickerCalendar
      value={value !== undefined ? value : internalValue}
      onChange={handleChange}
      {...props}
    />
  );
};

export default Calendar;
