'use client';
import React from 'react';
import Link from 'next/link';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ArrowUDownLeft } from '@phosphor-icons/react/dist/ssr/ArrowUDownLeft';
import { paths } from '@/paths';
import { DriverPending } from '@/components/dashboard/driver/driver-pending';

export default function Page(): React.JSX.Element {
  return (
    <Grid container direction="column" spacing={2} sx={{ marginBottom: '20px' }}>
      <Grid item xs={12} sx={{ marginBottom: '20px' }}>
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
          <Typography variant="h4">Driver Register</Typography>
        </Stack>
      </Grid>
      <Grid item xs={12} lg={8} xl={6}>
        <DriverPending />
      </Grid>
    </Grid>
  );
}
