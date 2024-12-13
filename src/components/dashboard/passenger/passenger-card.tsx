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
  const [passenger, setPassenger] = useState<Passenger | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorText, setErrorText] = useState<string | null>(null);

  useEffect(() => {
    const fetchPassenger = async () => {
      try {
        if (!passengerId) {
          setErrorText('No passenger ID found in the URL');
          return;
        }

        const passengersCollectionRef = collection(db, 'passengers');
        const passengerRef = doc(passengersCollectionRef, passengerId);
        const passengerDoc = await getDoc(passengerRef);
        if (passengerDoc.exists()) {
          const passengerData = passengerDoc.data() as Passenger;
          setPassenger(passengerData);
        } else {
          setErrorText('Passenger not found');
        }
      } catch (error: any) {
        setErrorText(`Error fetching passenger data: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    void fetchPassenger();
  }, [passengerId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (errorText) {
    return <div>Error: {errorText}</div>;
  }

  if (!passengerId) {
    return <div>No passenger ID found in the URL</div>;
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
              <Typography variant="h5">{passenger?.passengerName}</Typography>
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

