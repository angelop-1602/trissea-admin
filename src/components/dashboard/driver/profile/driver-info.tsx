'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, Divider, Grid, Stack, Typography } from '@mui/material';

import { collection, doc, getDoc, type DocumentReference, type CollectionReference } from 'firebase/firestore/lite';
import { db } from '../../firebase/FirebaseConfig';
import { useSearchParams } from 'next/navigation';

interface Driver {
  caseNumber: string;
  contactNumber: string;
  email: string;
  fullName: string;
  operatorName: string;
  vehicleNumber: string;
}

export function DriverInfo(): React.ReactElement {
  const searchParams = useSearchParams();
  const driverId = searchParams.get('id');
  const [driver, setDriver] = useState<Driver | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorText, setErrorText] = useState<string | null>(null); // Renamed error to avoid shadowing

  useEffect(() => {
    const fetchDriver = async () => {
      try {
        if (!driverId) {
          setErrorText('No driver ID found in the URL');
          return;
        }

        const driversCollectionRef = collection(db, 'drivers');
        const driverRef = doc(driversCollectionRef, driverId);
        const driverDoc = await getDoc(driverRef);
        if (driverDoc.exists()) {
          const driverData = driverDoc.data() as Driver;
          setDriver(driverData);
        } else {
          setErrorText('Driver not found');
        }
      } catch (error: any) {
        setErrorText(`Error fetching driver data: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    void fetchDriver();
  }, [driverId]);
  if (loading) {
    return <div>Loading...</div>;
  }

  if (errorText) {
    return <div>Error: {errorText}</div>;
  }

  // Ensure to handle case when driverId is null
  if (!driverId) {
    return <div>No driver ID found in the URL</div>;
  }

  return (
    <Card variant="outlined">
      <Grid item md={6} xs={12}>
        <Stack sx={{ m: 2 }}>
          <Typography variant="h3">Profile</Typography>
        </Stack>
      </Grid>
      <Divider />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item md={6} xs={12}>
            <Typography variant="h5" gutterBottom>
              Full Name:
            </Typography>
            <Typography variant="h6" color="text.secondary">
              {driver?.fullName}
            </Typography>
          </Grid>
          <Grid item md={6} xs={12}>
            <Typography variant="h5" gutterBottom>
              Operator Name:
            </Typography>
            <Typography variant="h6" color="text.secondary">
              {driver?.operatorName}
            </Typography>
          </Grid>
          <Grid item md={6} xs={12}>
            <Typography variant="h5" gutterBottom>
              Email:
            </Typography>
            <Typography variant="h6" color="text.secondary">
              {driver?.email}
            </Typography>
          </Grid>
          <Grid item md={6} xs={12}>
            <Typography variant="h5" gutterBottom>
              Contact Number:
            </Typography>
            <Typography variant="h6" color="text.secondary">
              {driver?.contactNumber}
            </Typography>
          </Grid>
          <Grid item md={6} xs={12}>
            <Typography variant="h5" gutterBottom>
              Vehicle Number:
            </Typography>
            <Typography variant="h6" color="text.secondary">
              {driver?.vehicleNumber}
            </Typography>
          </Grid>
          <Grid item md={6} xs={12}>
            <Typography variant="h5" gutterBottom>
              Case Number:
            </Typography>
            <Typography variant="h6" color="text.secondary">
              {driver?.caseNumber}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
