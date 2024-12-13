import * as React from 'react';
import type { Metadata } from 'next';
import { Box, Grid } from '@mui/material';
import { config } from '@/config';
import { Analytics } from '@/components/dashboard/overview/analytics';
import { RecentTrips } from '@/components/dashboard/overview/recent-trips';
import { Reports } from '@/components/dashboard/overview/reports';
import { Weather } from '@/components/dashboard/overview/weather';
import { paths } from '@/paths';


export const metadata = { title: `Overview | Dashboard | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  const destination = "Tuguegarao City";

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={8} sm={8}>
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Analytics />
          </Box>
        </Grid>
        <Grid item xs={4} sm={4}>
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Weather destination={destination} />
          </Box>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Reports />
        </Grid>
        <Grid item xs={12} sm={8}>
       <RecentTrips />
        </Grid>
      </Grid>
    </Box>
  );
}
