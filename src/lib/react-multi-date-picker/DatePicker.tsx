'use client';

import ReactMultiDatePickerDatePicker, {
  DatePickerProps as ReactMultiDatePickerDatePickerProps,
} from 'react-multi-date-picker';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface DatePickerProps extends ReactMultiDatePickerDatePickerProps {}

const DatePicker = (props: DatePickerProps) => {
  return <ReactMultiDatePickerDatePicker {...props} />;
};

export default DatePicker;
