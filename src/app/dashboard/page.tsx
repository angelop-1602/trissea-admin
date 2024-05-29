import * as React from 'react';
import type { Metadata } from 'next';
import { Card, CardHeader, Divider } from '@mui/material';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';

import { config } from '@/config';
import { Analytics } from '@/components/dashboard/overview/analytics';
import { RecentTrips } from '@/components/dashboard/overview/recent-trips';
import { Reports } from '@/components/dashboard/overview/reports';

export const metadata = { title: `Overview | Dashboard | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Analytics />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Reports />
        </Grid>
        <Grid item xs={12} sm={8}>
          <Card>
            <CardHeader title="Trips" />
            <Divider />
            <RecentTrips />
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
