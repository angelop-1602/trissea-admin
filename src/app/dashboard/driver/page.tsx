'use client';
import React, { useState } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { DriverFilters } from '@/components/dashboard/driver/header/driver-filters';
import { DriverTable } from '@/components/dashboard/driver/driver-table';
import { useFetchDrivers } from '@/components/dashboard/driver/fetchdriver-data';

export default function Page(): React.JSX.Element {
  const [searchQuery, setSearchQuery] = useState('');
  const { filteredDrivers } = useFetchDrivers(searchQuery);
  const handleSearch = (query: string): void => {
    setSearchQuery(query);
  };

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Driver</Typography>
        </Stack>
      </Stack>
      <DriverFilters onSearch={handleSearch} />
      <DriverTable searchQuery={searchQuery} />
    </Stack>
  );
}
