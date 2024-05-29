import React from 'react';
import Stack from '@mui/material/Stack';
import { TodaTable } from '@/components/dashboard/toda/toda-table';
import { TodaHeader } from '@/components/dashboard/toda/toda-header';

export default function Page(): React.JSX.Element {

  return (
    <Stack spacing={3}>
      {/* <TodaHeader/> */}
      <TodaTable/>
    </Stack>
  );
}
