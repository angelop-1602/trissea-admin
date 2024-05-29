import React, { useEffect, useState } from 'react';
import { TablePagination } from '@mui/material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import { off, onValue, ref } from 'firebase/database';

import { rtdb } from '../firebase/FirebaseConfig';

interface Driver {
  id: string;
  caseNumber: string;
  fullName: string;
  operatorName: string;
  contactNumber: string;
  vehicleNumber: string;
  fsbDriver: string;
}

export function RealTimeDrivers(): React.JSX.Element {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const db = rtdb;
    const driversRef = ref(db, 'Drivers/');

    const fetchData = () => {
      onValue(driversRef, (snapshot) => {
        const data: unknown = snapshot.val();
        if (data) {
          const driversArray: Driver[] = Object.values(data);
          setDrivers(driversArray);
        }
      });
    };

    fetchData();

    return () => {
      off(driversRef);
    };
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const filteredDrivers = drivers.filter((driver) =>
    Object.values(driver).some(
      (value) => typeof value === 'string' && value.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Stack>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto', marginBottom: 4 }}>
          <Typography variant="h4">Database Driver</Typography>
        </Stack>
      </Stack>
      <Card sx={{ p: 2, marginBottom: 3 }}>
        <OutlinedInput
          value={searchQuery}
          onChange={handleSearchChange}
          fullWidth
          placeholder="Search Driver"
          startAdornment={
            <InputAdornment position="end">
              <MagnifyingGlassIcon fontSize="var(--icon-fontSize-md)" />
            </InputAdornment>
          }
          sx={{ maxWidth: '500px', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)' }}
        />
      </Card>

      <Card>
        <Box sx={{ overflowX: 'auto' }}>
          <Table sx={{ minWidth: '800px' }}>
            <TableHead>
              <TableRow>
                <TableCell align="center">Driver Name</TableCell>
                <TableCell align="center">Case Number</TableCell>
                <TableCell align="center">Vehicle Number</TableCell>
                <TableCell align="center">Contact Number</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                ? filteredDrivers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                : filteredDrivers
              ).map((driver, index) => (
                <TableRow key={index} hover>
                  <TableCell align="center">{driver.fullName}</TableCell>
                  <TableCell align="center">{driver.caseNumber}</TableCell>
                  <TableCell align="center">{driver.vehicleNumber}</TableCell>
                  <TableCell align="center">{driver.contactNumber}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
        <Divider />
        <TablePagination
          rowsPerPageOptions={[10, 20, 30]} // Options for rows per page
          component="div"
          count={filteredDrivers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Stack>
  );
}
