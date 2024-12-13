"use client";
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore/lite';
import { db } from '../../firebase/FirebaseConfig';

interface Trip {
  feedback: number;
}

interface Driver {
  fullName: string;
  contactNumber: string;
  email: string;
  caseNumber: string;
  feedback: number;
  totalTrips: number;
}

export default function DriverCard(): React.JSX.Element {
  const searchParams = useSearchParams();
  const driverId = searchParams.get('id');

  const [driver, setDriver] = useState<Driver | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchDriverDetails(id: string | null): Promise<void> {
    if (id) {
      try {
        const driversCollectionRef = collection(db, 'drivers');
        const driverDocRef = doc(driversCollectionRef, id);
        const driverDocSnapshot = await getDoc(driverDocRef);

        if (driverDocSnapshot.exists()) {
          const driverData = driverDocSnapshot.data() as Driver;

          const tripsQuery = query(collection(db, 'trips'), where('driverId', '==', id));
          const todayTripsQuery = query(collection(db, 'todayTrips'), where('driverId', '==', id));
          const [tripsSnapshot, todayTripsSnapshot] = await Promise.all([
            getDocs(tripsQuery),
            getDocs(todayTripsQuery)
          ]);

          let totalFeedback = 0;
          let totalTrips = 0;
          tripsSnapshot.forEach(doc => {
            const tripData = doc.data() as Trip;
            totalFeedback += tripData.feedback || 0;
            totalTrips++;
          });
          todayTripsSnapshot.forEach(doc => {
            const tripData = doc.data() as Trip;
            totalFeedback += tripData.feedback || 0;
            totalTrips++;
          });

          setDriver({
            ...driverData,
            feedback: totalFeedback,
            totalTrips
          });
        } else {
          setError('Driver not found.');
        }
      } catch (error: any) { // Typing the error parameter as any
        setError(`Error fetching driver details: ${  error.message}`);
      } finally {
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    void fetchDriverDetails(driverId);
  }, [driverId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Stack spacing={3}>
      <Card>
        <CardContent>
          <Stack spacing={2} sx={{ alignItems: 'center' }}>
            <div>
              <Avatar sx={{ height: '80px', width: '80px' }} />
            </div>
            <Stack spacing={1} sx={{ textAlign: 'center' }}>
              <Typography variant="h5">{driver?.fullName}</Typography>
              <Typography color="text.secondary" variant="body2">
                {driver?.contactNumber}
              </Typography>
              <Typography color="text.secondary" variant="body2">
                {driver?.caseNumber}
              </Typography>
            </Stack>
          </Stack>
        </CardContent>
        <Divider />
        <Stack
          direction="row"
          justifyContent="space-evenly"
          alignItems="center"
          spacing={2}
          divider={<Divider orientation="vertical" flexItem />}
          sx={{ padding: '1.5rem' }}
        >
          <Stack spacing={2} sx={{ textAlign: 'center' }}>
            <Typography variant="h5">Rating</Typography>
            <Typography variant="h6" color="text.secondary">
              {driver?.totalTrips ? (driver.feedback / driver.totalTrips).toFixed(2) : 'N/A'}
            </Typography>
          </Stack>
          <Stack spacing={2} sx={{ textAlign: 'center' }}>
            <Typography variant="h5">Total Trips</Typography>
            <Typography variant="h6" color="text.secondary">
              {driver?.totalTrips || 0}
            </Typography>
          </Stack>
        </Stack>
      </Card>
    </Stack>
  );
}
