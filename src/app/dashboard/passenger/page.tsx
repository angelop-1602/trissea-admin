'use client';
import React, { useState } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { PassengerTable } from '@/components/dashboard/passenger/passenger-table';
import { PassengerFilters } from '@/components/dashboard/passenger/passenger-filters';

export default function Page(): React.JSX.Element {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query: string): void => {
    setSearchQuery(query);
  };



  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Passenger</Typography>
        </Stack>
      </Stack>
      <PassengerFilters onSearch={handleSearch} />
      <PassengerTable
        searchQuery={searchQuery}
      />
    </Stack>
  );
}
