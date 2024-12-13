'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ArrowUDownLeft } from '@phosphor-icons/react/dist/ssr/ArrowUDownLeft';
import { paths } from '@/paths';
import { RecentTrips } from '@/components/dashboard/overview/recent-trips';
import CustomDatePicker from '@/components/dashboard/overview/custom-date-picker';
import dayjs from 'dayjs';

export default function Page(): React.JSX.Element {
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(dayjs());

  const handleDateChange = (date: dayjs.Dayjs | null) => {
    setSelectedDate(date);
  };

  return (
    <Grid container direction="column" spacing={2} sx={{ marginBottom: '20px' }}>
      <Grid item xs={12} sx={{ marginBottom: '20px' }}>
        <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
          <Stack direction="row" spacing={1} alignItems="center">
            <Link href={paths.dashboard.overview}>
              <Button
                variant="contained"
                size="large"
                startIcon={<ArrowUDownLeft size={30} />}
                color='secondary'
              >
                Back
              </Button>
            </Link>
            <Typography variant="h4">Recent Trips</Typography>
          </Stack>
          <CustomDatePicker
            selectedDate={selectedDate}
            onDateChange={handleDateChange}
          />
        </Stack>
      </Grid>
      <Grid item xs={12} lg={8} xl={6}>
        <RecentTrips />
      </Grid>
      
    </Grid>
  );
}
