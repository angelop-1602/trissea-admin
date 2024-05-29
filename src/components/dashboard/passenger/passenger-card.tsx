import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { collection, doc, getDoc } from 'firebase/firestore/lite';

import { db } from '../firebase/FirebaseConfig';

export interface Passenger {
  firstName: string;
  lastName: string;
  email: string;
  userType: string;
  passengerName: string;
}


export default function PassengerCard(): React.JSX.Element {
  const searchParams = useSearchParams();
  const passengerId = searchParams.get('id');

  // Define state variables
  const [passenger, setPassenger] = useState<Passenger | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch passenger details
  async function fetchPassengerDetails(id: string | null): Promise<void> {
    if (id) {
      try {
        const passengerDocRef = doc(collection(db, 'passengers'), id);
        const passengerDocSnapshot = await getDoc(passengerDocRef);

        if (passengerDocSnapshot.exists()) {
          const passengerData = passengerDocSnapshot.data() as Passenger;
          setPassenger(passengerData);
        } else {
          setError('Passenger not found.');
        }
      } catch (error) {
        setError(`Error fetching passenger details: ${  error.message}`);
      } finally {
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    void fetchPassengerDetails(passengerId);
  }, [passengerId]);

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
              <Typography variant="h5">{`${passenger?.passengerName}`}</Typography>
              <Typography color="text.secondary" variant="body2">
                {passenger?.email}
              </Typography>
              <Typography color="text.secondary" variant="body2">
                {passenger?.userType}
              </Typography>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}

