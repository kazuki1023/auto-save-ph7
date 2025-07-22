'use client';

import { useState } from 'react';
import ReactMultiDatePickerDatePicker, {
  DateObject,
} from 'react-multi-date-picker';

const DatePicker = () => {
  const [value, setValue] = useState<DateObject | null>(null);
  return <ReactMultiDatePickerDatePicker value={value} onChange={setValue} />;
};

export default DatePicker;
