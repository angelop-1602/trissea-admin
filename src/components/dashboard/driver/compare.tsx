import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Backdrop, Button, Card, CardContent, Divider, Grid, Snackbar, Stack, Typography } from '@mui/material';
import { get, ref } from 'firebase/database';
import { doc, getDoc, updateDoc } from 'firebase/firestore/lite';

import { paths } from '@/paths';

import { db, rtdb } from '../firebase/FirebaseConfig';

interface Driver {
  id: string;
  caseNumber: string;
  fullName: string;
  operatorName: string;
  contactNumber: string;
  vehicleNumber: string;
  fsbDriver: string;
}

interface CompareProps {
  handleSnackbar: (message: string) => void;
}

export function Compare({ handleSnackbar }: CompareProps): React.JSX.Element {
  const [realtimeDriver, setRealtimeDriver] = useState<Driver | null>(null);
  const [firestoreDriver, setFirestoreDriver] = useState<Driver | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [confirmationOpen, setConfirmationOpen] = useState<boolean>(false);
  const [actionType, setActionType] = useState<string>('');

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchDriversInfo = async (): Promise<void> => {
      try {
        setLoading(true);
        const fsdbDriver = searchParams.get('id');
        if (fsdbDriver) {
          const driverRef = doc(db, 'drivers', fsdbDriver);
          const driverDoc = await getDoc(driverRef);

          if (driverDoc.exists()) {
            const data = driverDoc.data() as Driver;
            setFirestoreDriver(data);
            const caseNumber = data.caseNumber;

            const realtimeDriversRef = ref(rtdb, `Drivers/${caseNumber}`);
            const realtimeSnapshot = await get(realtimeDriversRef);
            const realtimeDriverData = realtimeSnapshot.val();
            const rtDriver: Driver | null = realtimeDriverData ? realtimeDriverData : null;
            setRealtimeDriver(rtDriver);
          } else {
            throw new Error('Driver not found in Firestore');
          }
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          setErrorMsg(error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    void fetchDriversInfo();
  }, [searchParams]);

  const handleValidation = (): void => {
    try {
      if (firestoreDriver && firestoreDriver.id) {
        setActionType('valid');
        setConfirmationOpen(true);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        handleSnackbar('Failed to validate driver.');
      }
    }
  };

  const confirmValidation = async (): Promise<void> => {
    if (!firestoreDriver || !firestoreDriver.id) {
      handleSnackbar('No driver selected or driver ID missing.');
      return;
    }
    try {
      await updateDoc(doc(db, 'drivers', firestoreDriver.id), { valid: true });
      handleSnackbar('Driver validated successfully.');
      router.push(paths.components.driverPending);
    } catch (error: unknown) {
      if (error instanceof Error) {
        handleSnackbar('Failed to validate driver.');
      }
    }
  };

  const handleRejection = (): void => {
    try {
      if (firestoreDriver && firestoreDriver.id) {
        setActionType('reject');
        setConfirmationOpen(true);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        handleSnackbar('Failed to reject driver.');
      }
    }
  };

  const confirmRejection = async (): Promise<void> => {
    if (!firestoreDriver || !firestoreDriver.id) {
      handleSnackbar('No driver selected or driver ID missing.');
      return;
    }
    try {
      await updateDoc(doc(db, 'drivers', firestoreDriver.id), { reject: true });
      handleSnackbar('Driver rejected successfully.');
      router.push(paths.components.driverReject);
    } catch (error: unknown) {
      if (error instanceof Error) {
        handleSnackbar('Failed to reject driver.');
      }
    }
  };

  const handleConfirmation = (): void => {
    setConfirmationOpen(false);
    if (actionType === 'valid') {
      confirmValidation();
    } else if (actionType === 'reject') {
      confirmRejection();
    }
  };

  const handleConfirmationCancel = (): void => {
    setConfirmationOpen(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (errorMsg) {
    return <div>Error: {errorMsg}</div>;
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        {firestoreDriver ? (
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h3">Registering Driver</Typography>
              <Divider />
              <Typography variant="h5" gutterBottom>
                Case Number:
              </Typography>
              <Typography variant="h6" color="text.secondary">
                {firestoreDriver.caseNumber}
              </Typography>
              <Typography variant="h5" gutterBottom>
                Full Name:
              </Typography>
              <Typography variant="h6" color="text.secondary">
                {firestoreDriver.fullName}
              </Typography>
              <Typography variant="h5" gutterBottom>
                Operator Name:
              </Typography>
              <Typography variant="h6" color="text.secondary">
                {firestoreDriver.operatorName}
              </Typography>
              <Typography variant="h5" gutterBottom>
                Contact Number:
              </Typography>
              <Typography variant="h6" color="text.secondary">
                {firestoreDriver.contactNumber}
              </Typography>
              <Typography variant="h5" gutterBottom>
                Vehicle Number:
              </Typography>
              <Typography variant="h6" color="text.secondary">
                {firestoreDriver.vehicleNumber}
              </Typography>
            </CardContent>
          </Card>
        ) : null}
      </Grid>
      <Grid item xs={6}>
        {realtimeDriver ? (
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h3">Driver from Database</Typography>
              <Divider />
              <Typography variant="h5" gutterBottom>
                Case Number:
              </Typography>
              <Typography variant="h6" color="text.secondary">
                {realtimeDriver.caseNumber}
              </Typography>
              <Typography variant="h5" gutterBottom>
                Full Name:
              </Typography>
              <Typography variant="h6" color="text.secondary">
                {realtimeDriver.fullName}
              </Typography>
              <Typography variant="h5" gutterBottom>
                Operator Name:
              </Typography>
              <Typography variant="h6" color="text.secondary">
                {realtimeDriver.operatorName}
              </Typography>
              <Typography variant="h5" gutterBottom>
                Contact Number:
              </Typography>
              <Typography variant="h6" color="text.secondary">
                {realtimeDriver.contactNumber}
              </Typography>
              <Typography variant="h5" gutterBottom>
                Vehicle Number:
              </Typography>
              <Typography variant="h6" color="text.secondary">
                {realtimeDriver.vehicleNumber}
              </Typography>
            </CardContent>
          </Card>
        ) : null}
      </Grid>
      <Grid item xs={12}>
        <Card elevation={3} sx={{ padding: '20px' }}>
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              variant="contained"
              onClick={handleValidation}
              sx={{
                maxWidth: '500px',
                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
              }}
            >
              <b>Valid</b>
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleRejection}
              sx={{
                maxWidth: '500px',
                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
              }}
            >
              <b>Reject</b>
            </Button>
          </Stack>
        </Card>
      </Grid>
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={confirmationOpen}>
        <Snackbar
          message={`Are you sure you want to ${actionType} ${firestoreDriver?.fullName}?`}
          open={confirmationOpen}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          action={
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                onClick={handleConfirmation}
              >
                Confirm
              </Button>
              <Button variant="outlined" color="primary" onClick={handleConfirmationCancel}>
                Cancel
              </Button>
            </Stack>
          }
        />
      </Backdrop>
    </Grid>
  );
}
