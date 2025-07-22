'use client';

import { useState } from 'react';
import ReactMultiDatePickerDatePicker, {
  DateObject,
} from 'react-multi-date-picker';

interface DatePickerProps {
  value: DateObject | null;
  onChange: (value: DateObject | null) => void;
  [key: string]: any; // Allow additional props
}

const DatePicker: React.FC<DatePickerProps> = ({ value, onChange, ...rest }) => {
  return <ReactMultiDatePickerDatePicker value={value} onChange={onChange} {...rest} />;
};

export default DatePicker;
