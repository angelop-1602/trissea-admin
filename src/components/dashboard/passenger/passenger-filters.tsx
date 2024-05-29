import * as React from 'react';
import { useState } from 'react';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';

export function PassengerFilters({ onSearch }: { onSearch: (query: string) => void }): React.JSX.Element {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const query = event.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  return (
    <Card elevation={3}>
      <Stack sx={{ p: 2 }} direction="row" alignItems="center" justifyContent="space-between">
        <OutlinedInput
          value={searchQuery}
          onChange={handleSearchChange}
          fullWidth
          placeholder="Search Passenger"
          startAdornment={
            <InputAdornment position="end">
              <MagnifyingGlassIcon fontSize="var(--icon-fontSize-md)" />
            </InputAdornment>
          }
          sx={{ maxWidth: '500px', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)' }}
        />
      </Stack>
    </Card>
  );
}
