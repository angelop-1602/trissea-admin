'use client';

import React from 'react';
import Link from 'next/link';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ArrowUDownLeft } from '@phosphor-icons/react/dist/ssr/ArrowUDownLeft';

import { paths } from '@/paths';
import PassengerCard from '@/components/dashboard/passenger/passenger-card';
import { PassengerTrip } from '@/components/dashboard/passenger/passenger-trips';

export default function Page(): React.JSX.Element {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Link href={paths.dashboard.passenger}>
            <Button
              variant="contained"
              size="large"
              startIcon={<ArrowUDownLeft size={30} />}
              color='secondary'
            >
              Back
            </Button>
          </Link>
          <Typography variant="h4">Passenger Profile</Typography>
        </Stack>
      </Grid>
      <Grid item xs={12} md={6} lg={4}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
          <PassengerCard />
          </Grid>
          <Grid item xs={12} />
        </Grid>
      </Grid>
      <Grid item xs={12} md={6} lg={8}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <PassengerTrip />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
