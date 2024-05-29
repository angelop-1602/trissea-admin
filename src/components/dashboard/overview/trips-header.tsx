import * as React from 'react';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Hidden from '@mui/material/Hidden';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';

export interface TripHeaderProps {
  onDateChange: (date: dayjs.Dayjs | null) => void;
  onFilterChange: (status: string | null) => void;
}

export function TripHeader({ onDateChange, onFilterChange }: TripHeaderProps): React.JSX.Element {
  const [selectedDate, setSelectedDate] = React.useState<dayjs.Dayjs | null>(dayjs());
  const [activeButton, setActiveButton] = React.useState<string>('Ongoing');

  const handleDateChange = (date: dayjs.Dayjs | null): void => {
    setSelectedDate(date);
    if (date) {
      onDateChange(date);
    }
  };

  const handleButtonClick = (status: string) => {
    setActiveButton(status);
    onFilterChange(status); // Trigger filter change immediately when button is clicked
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={8}>
      <Grid container  spacing={2} sx={{m:2}}>
          <Grid item>
            <Button
              variant={activeButton === 'Ongoing' ? 'contained' : 'outlined'}
              color="primary"
              onClick={() => { handleButtonClick('Ongoing'); }}
            >
              Ongoing
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant={activeButton === 'Completed' ? 'contained' : 'outlined'}
              color="primary"
              onClick={() => { handleButtonClick('Completed'); }}
            >
              Completed
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant={activeButton === 'Canceled' ? 'contained' : 'outlined'}
              color="primary"
              onClick={() => { handleButtonClick('Canceled'); }}
            >
              Canceled
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={4}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="MM/DD/YYYY"
            sx={{ margin: '2rem' }}
            value={selectedDate}
            onChange={(newDate: unknown) => {
              handleDateChange(newDate as dayjs.Dayjs | null);
            }}
          />
        </LocalizationProvider>
      </Grid>
    </Grid>
  );
}
