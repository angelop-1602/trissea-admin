import * as React from 'react';
import { useRouter } from 'next/navigation';
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
import TablePagination from '@mui/material/TablePagination';
import { collection, getDocs, query } from 'firebase/firestore/lite';

import { paths } from '@/paths';
import { db } from '../firebase/FirebaseConfig';
import { Fragment } from 'react';

export interface Passenger {
  id: string;
  firstName: string;
  lastName: string;
  passengerName: string;
  email: string;
  password: string;
  userType: string;
}
interface PassengerTableProps {
  searchQuery?: string;
}
export function PassengerTable({ searchQuery = '' }: PassengerTableProps): React.ReactElement {
  const [passengers, setPassengers] = React.useState<Passenger[]>([]);
  const [filteredPassengers, setFilteredPassengers] = React.useState<Passenger[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const router = useRouter();

  React.useEffect(() => {
    const fetchPassengers = async () => {
      const passengersCollection = collection(db, 'passengers');
      const passengersQuery = query(passengersCollection);
      const snapshot = await getDocs(passengersQuery);
      const passengersData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Passenger);
      setPassengers(passengersData);
    };

    void fetchPassengers();
  }, []);

  React.useEffect(() => {
    const filtered = passengers.filter((passenger) => {
      const fullNameMatch =
        passenger.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        passenger.firstName.toUpperCase().includes(searchQuery.toUpperCase()) ||
        passenger.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        passenger.lastName.toUpperCase().includes(searchQuery.toUpperCase()) ||
        passenger.passengerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        passenger.email.toLowerCase().includes(searchQuery.toLowerCase());
      return fullNameMatch;
    });
    setFilteredPassengers(filtered);
  }, [passengers, searchQuery]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewProfile = (id: string) => {
    router.push(`${paths.dashboard.passengerProfile}${id}`);
  };

  function getColorFromId(id: string): string {
    const colors: string[] = [
      '#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5',
      '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50',
      '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800',
      '#ff5722', '#795548', '#9e9e9e', '#607d8b',
    ];

    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }

    const index = Math.abs(hash) % colors.length;
    return colors[index];
  }

  return (
    <Card>
      <Box sx={{ overflowX: 'auto' }}>
        {filteredPassengers.length === 0 ? (
          <Typography variant="h5" align="center" color="textSecondary">
            No passengers match the search criteria.
          </Typography>
        ) : (
          <Fragment>
            <Table sx={{ minWidth: '800px' }}>
              <TableHead>
                <TableRow>
                  <TableCell />
                  <TableCell align="center">Passenger Name</TableCell>
                  <TableCell align="center">Email</TableCell>
                  <TableCell align="center">User Type</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredPassengers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((passenger) => (
                  <TableRow hover key={passenger.id}>
                    <TableCell align="center">
                      <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
                        <Avatar sx={{ bgcolor: getColorFromId(passenger.id) }}>
                          {passenger.firstName && passenger.firstName.length > 0
                            ? passenger.firstName.charAt(0).toUpperCase()
                            : ''}
                        </Avatar>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Typography align="center">{`${passenger.firstName} ${passenger.lastName}`}</Typography>
                    </TableCell>
                    <TableCell align="center">{passenger.email}</TableCell>
                    <TableCell align="center">{passenger.userType}</TableCell>
                    <TableCell align="center">
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                          handleViewProfile(passenger.id);
                        }}
                      >
                        View Profile
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              component="div"
              count={filteredPassengers.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[10, 20, 30]}
            />
          </Fragment>
        )}
      </Box>
      <Divider />
    </Card>
  );
}

