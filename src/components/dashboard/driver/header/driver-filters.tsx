import * as React from 'react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Typography } from '@mui/material';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import { useRouter } from 'next/navigation';
import { collection, getDocs, query, where } from 'firebase/firestore/lite';
import { paths } from '@/paths';
import { db } from '../../firebase/FirebaseConfig'; 

export function DriverFilters({ onSearch }: { onSearch: (query: string) => void }): React.JSX.Element {
  const [searchQuery, setSearchQuery] = useState('');
  const [pendingCount, setPendingCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const fetchPendingCount = async () => {
      try {
        const querySnapshot = await getDocs(
          query(collection(db, 'drivers'), where('valid', '==', false), where('reject', '==', false))
        );
        setPendingCount(querySnapshot.docs.length); // Update the state with the count of pending drivers
      } catch (error) {

      }
    };

    void fetchPendingCount();
  }, []);
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
          placeholder="Search Driver"
          startAdornment={
            <InputAdornment position="end">
              <MagnifyingGlassIcon fontSize="var(--icon-fontSize-md)" />
            </InputAdornment>
          }
          sx={{ maxWidth: '500px', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)' }}
        />

        <Stack direction="row" spacing={2}>
          <Link href={paths.components.driverPending} passHref>
            <Button variant="outlined" sx={{ maxWidth: '500px', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)' }}>
              <Stack>
                <Typography>{'('}{pendingCount}{')'}</Typography>
              </Stack>
              <Stack>
                <b>Pending</b>
              </Stack>
            </Button>
          </Link>
          <Link href={paths.components.driverReject} passHref>
            <Button variant="outlined" sx={{ maxWidth: '500px', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)' }}>
              <b>Reject</b>
            </Button>
          </Link>
        </Stack>
      </Stack>
    </Card>
  );
}
