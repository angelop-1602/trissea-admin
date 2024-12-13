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
import { collection, getDocs, query, where } from 'firebase/firestore/lite';
import TablePagination from '@mui/material/TablePagination';
import Pagination from '@mui/material/Pagination'; // Import Pagination
import { paths } from '@/paths';

import { db } from '../firebase/FirebaseConfig';

export interface Driver {
  id: string;
  name: string;
  fullName: string;
  caseNumber: string;
  vehicleNumber: string;
  contactNumber: string;
  driver: string;
}

interface DriversTableProps {
  searchQuery?: string;
}



export function DriverTable({ searchQuery = '' }: DriversTableProps): React.ReactElement {
  const [drivers, setDrivers] = React.useState<Driver[]>([]);
  const [filteredDrivers, setFilteredDrivers] = React.useState<Driver[]>([]);
  const [page, setPage] = React.useState(0); // Start page index at 0
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const router = useRouter();

  React.useEffect(() => {
    const fetchData = async () => {
      const driversCollection = collection(db, 'drivers');
      const driversQuery = query(driversCollection, where('valid', '==', true));
      const snapshot = await getDocs(driversQuery);
      const driversData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Driver);
      setDrivers(driversData);
    };

    void fetchData();
  }, []);

  React.useEffect(() => {
    const filtered = drivers.filter((driver) => {
      const fullNameMatch = driver.fullName.toLowerCase().includes(searchQuery.toLowerCase());
      const caseNumberMatch = driver.caseNumber.toLowerCase().includes(searchQuery.toLowerCase());
      const vehicleNumberMatch = driver.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase());
      const contactNumberMatch = driver.contactNumber.toLowerCase().includes(searchQuery.toLowerCase());

      return fullNameMatch || caseNumberMatch || vehicleNumberMatch || contactNumberMatch;
    });
    setFilteredDrivers(filtered);
  }, [drivers, searchQuery]);

  const handleChangePage = (event: unknown, newPage: number): void => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page
  };

  const handleViewProfile = (id: string) => {
    router.push(`${paths.dashboard.driverProfile}${id}`);
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
        {filteredDrivers.length === 0 ? (
          <Typography variant="h5" align="center" color="textSecondary">
            No drivers match.
          </Typography>
        ) : (
          <>
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
                {filteredDrivers
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow hover key={row.id}>
                      <TableCell />
                      <TableCell align="center">
                        <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
                          <Avatar sx={{ bgcolor: getColorFromId(row.id) }}>
                            {row.fullName.charAt(0).toUpperCase()}
                          </Avatar>
                          <Typography variant="subtitle2">{row.name}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align="center">{row.fullName}</TableCell>
                      <TableCell align="center">{row.caseNumber}</TableCell>
                      <TableCell align="center">{row.vehicleNumber}</TableCell>
                      <TableCell align="center">{row.contactNumber}</TableCell>
                      <TableCell align="center">
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleViewProfile(row.id)}
                        >
                          View Profile
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[10, 20, 30]}
              component="div"
              count={filteredDrivers.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )}
      </Box>
      <Divider />
    </Card>
  );
}
