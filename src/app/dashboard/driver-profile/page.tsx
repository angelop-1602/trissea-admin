import React from 'react';
import Link from 'next/link';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ArrowUDownLeft } from '@phosphor-icons/react/dist/ssr/ArrowUDownLeft';

import { paths } from '@/paths';
import DriverCard from '@/components/dashboard/driver/profile/driver-card';
import { DriverInfo } from '@/components/dashboard/driver/profile/driver-info';
import { DriverReview } from '@/components/dashboard/driver/profile/driver-review';
import { DriverTrips } from '@/components/dashboard/driver/profile/driver-trips';

export default function Page(): React.JSX.Element {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Link href={paths.dashboard.driver}>
            <Button
              variant="contained"
              size="large"
              startIcon={<ArrowUDownLeft size={30} />}
              color='secondary'
            >
              Back
            </Button>
          </Link>
          <Typography variant="h4">Driver Profile</Typography>
        </Stack>
      </Grid>
      <Grid item xs={12} md={6} lg={4}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <DriverCard />
          </Grid>
          <Grid item xs={12}>
            <DriverReview driverId={''} />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} md={6} lg={8}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <DriverInfo />
          </Grid>
          <Grid item xs={12}>
            <DriverTrips />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
