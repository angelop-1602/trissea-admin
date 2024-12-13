import React, { useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { collection, getDocs, query, where } from 'firebase/firestore/lite';
import { db } from '../firebase/FirebaseConfig';
import { useRouter } from 'next/navigation';
import { paths } from '@/paths';

interface Driver {
  id: string;
  fullName: string;
  caseNumber: string;
  vehicleNumber: string;
  contactNumber: string;
  // Add more properties as needed
}

export function DriverReject(): React.ReactElement {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      const driversCollection = collection(db, 'drivers');
      const q = query(driversCollection, where('reject', '==', true));

      const querySnapshot = await getDocs(q);
      const fetchedDrivers: Driver[] = [];
      querySnapshot.forEach((doc) => {
        fetchedDrivers.push({ id: doc.id, ...doc.data() } as Driver);
      });
      setDrivers(fetchedDrivers);
    };

    void fetchData();
  }, []);
  const handleViewDriver = (driverId: string) => {
    router.push(`${paths.dashboard.driverCompare}${driverId}`);
  };
  return (
    <Card>
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: '800px' }}>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell />
              <TableCell align="center">Driver Name</TableCell>
              <TableCell align="center">Case Number</TableCell>
              <TableCell align="center">Vehicle Number</TableCell>
              <TableCell align="center">Contact Number</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {drivers.map((driver) => (
              <TableRow key={driver.id} hover>
                <TableCell />
                <TableCell align="center">
                  <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
                    <Avatar />
                  </Stack>
                </TableCell>
                <TableCell>
                  <Typography align="center">{driver.fullName}</Typography>
                </TableCell>
                <TableCell align="center">{driver.caseNumber}</TableCell>
                <TableCell align="center">{driver.vehicleNumber}</TableCell>
                <TableCell align="center">{driver.contactNumber}</TableCell>
                <TableCell align="center">
                <Button onClick={() => { handleViewDriver(driver.id); }}>View Driver</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
      <Divider />
    </Card>
  );
}
