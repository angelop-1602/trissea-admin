'use client'
import React, { useEffect, useState } from 'react';
import { Card, Divider, Grid, Stack, Typography } from '@mui/material';
import { collection, getDocs, query, where, doc as firestoreDoc, getDoc } from 'firebase/firestore/lite';
import { db } from '../firebase/FirebaseConfig';

interface TripData {
  driverId: string;
  feedback?: number;
}

interface DriverRating {
  totalRating: number;
  totalTrips: number;
}

export function Analytics(): React.JSX.Element {
  const [totalCompletedTrips, setTotalCompletedTrips] = useState<number>(0);
  const [totalPassengers, setTotalPassengers] = useState<number>(0);
  const [highestRatedDriver, setHighestRatedDriver] = useState<string | null>(null);
  const [noRatedDrivers, setNoRatedDrivers] = useState<boolean>(false);

  useEffect((): void => {
    const fetchTotalCompletedTrips = async (): Promise<void> => {
      const tripsCollectionRef = collection(db, 'trips');
      const todaTripsCollectionRef = collection(db, 'todaTrips');

      // Fetch completed trips from 'trips' collection
      const tripsQuery = query(tripsCollectionRef, where('arrived', '==', true));
      const tripsSnapshot = await getDocs(tripsQuery);
      const tripsCount = tripsSnapshot.size;

      // Fetch completed trips from 'todaTrips' collection
      const todaTripsQuery = query(todaTripsCollectionRef, where('arrived', '==', true));
      const todaTripsSnapshot = await getDocs(todaTripsQuery);
      const todaTripsCount = todaTripsSnapshot.size;

      // Total completed trips
      const totalCompletedTripsCount = tripsCount + todaTripsCount;
      setTotalCompletedTrips(totalCompletedTripsCount);
    };

    const fetchTotalPassengers = async (): Promise<void> => {
      const passengersCollectionRef = collection(db, 'passengers');
      const passengersSnapshot = await getDocs(passengersCollectionRef);
      setTotalPassengers(passengersSnapshot.size);
    };

    const fetchHighestRatedDriver = async (): Promise<void> => {
      const tripsCollectionRef = collection(db, 'trips');
      const tripsSnapshot = await getDocs(tripsCollectionRef);

      const todaTripsCollectionRef = collection(db, 'todaTrips');
      const todaTripsSnapshot = await getDocs(todaTripsCollectionRef);

      // Merge data from both collections into a single array
      const allTripsData: TripData[] = [];
      tripsSnapshot.forEach(tripDoc => allTripsData.push(tripDoc.data() as TripData));
      todaTripsSnapshot.forEach(tripDoc => allTripsData.push(tripDoc.data() as TripData));

      // Object to store driver ratings
      const driverRatings: Record<string, DriverRating> = {};

      allTripsData.forEach(tripData => {
        const driverId = tripData.driverId;
        const feedback = tripData.feedback || 0;
        const rating = feedback > 0 ? feedback / 10 : 0; // Normalize feedback to a rating scale of 0-10

        if (!driverRatings[driverId]) {
          driverRatings[driverId] = {
            totalRating: 0,
            totalTrips: 0,
          };
        }

        driverRatings[driverId].totalRating += rating;
        driverRatings[driverId].totalTrips++;
      });

      // Calculate average rating for each driver
      let maxRating = 0;
      let highestRatedDriverId: string | null = null;
      for (const driverId in driverRatings) {
        const totalRating = driverRatings[driverId].totalRating;
        const totalTrips = driverRatings[driverId].totalTrips;
        const averageRating = totalTrips > 0 ? totalRating / totalTrips : 0;
        if (averageRating > maxRating) {
          maxRating = averageRating;
          highestRatedDriverId = driverId;
        }
      }

      if (highestRatedDriverId) {
        // Fetch the driver's name using the highestRatedDriverId
        const driverDocRef = firestoreDoc(db, 'drivers', highestRatedDriverId);
        const driverDocSnapshot = await getDoc(driverDocRef);
        if (driverDocSnapshot.exists()) {
          const driverName = driverDocSnapshot.data().name as string;
         setHighestRatedDriver(driverName);
        } else {
          setHighestRatedDriver(highestRatedDriverId); // Fallback to ID if name is not found
        }
      } else {
        setNoRatedDrivers(true);
      }
    };

    void fetchTotalCompletedTrips();
    void fetchTotalPassengers();
    void fetchHighestRatedDriver();
  }, []);

  return (
    <Card sx={{ padding: '20px' }}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4} md={3}>
          <Stack spacing={3}>
            <Typography color="text.secondary" variant="overline">
              Total Completed Trips
            </Typography>
            <Typography variant="h2">{totalCompletedTrips}</Typography>
          </Stack>
        </Grid>
        <Divider orientation="vertical" variant="middle" flexItem />
        <Grid item xs={12} sm={4} md={3}>
          <Stack spacing={3}>
            <Typography color="text.secondary" variant="overline">
              Total Passengers
            </Typography>
            <Typography variant="h2">{totalPassengers}</Typography>
          </Stack>
        </Grid>
        <Divider orientation="vertical" variant="middle" flexItem />
        <Grid item xs={12} sm={4} md={5}>
          <Stack spacing={3}>
            <Typography color="text.secondary" variant="overline">
              Highest Rated Driver
            </Typography>
            <Typography variant="h2" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {noRatedDrivers ? 'No drivers with ratings' : highestRatedDriver}
            </Typography>
          </Stack>
        </Grid>
      </Grid>
    </Card>
  );
}
