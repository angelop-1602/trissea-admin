'use client';
import React from 'react';
import Stack from '@mui/material/Stack';
import { RealTimeDrivers } from '@/components/dashboard/realtime-db/rtdb-drivers';

export default function Page(): React.JSX.Element {

  return (
    <Stack spacing={3}>
      <RealTimeDrivers/>
    </Stack>
  );
}
