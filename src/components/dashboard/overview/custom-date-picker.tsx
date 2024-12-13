import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';

interface CustomDatePickerProps {
  selectedDate: dayjs.Dayjs | null;
  onDateChange: (date: dayjs.Dayjs | null) => void;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({ selectedDate, onDateChange }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label="MM/DD/YYYY"
        sx={{ margin: '2rem' }}
        value={selectedDate}
        onChange={(newDate: unknown) => {
          onDateChange(newDate as dayjs.Dayjs | null);
        }}
      />
    </LocalizationProvider>
  );
};

export default CustomDatePicker;