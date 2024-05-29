import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { CircularProgress } from '@mui/material';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { collection, getDocs, query, where } from 'firebase/firestore/lite';

import { db } from '../../firebase/FirebaseConfig';

interface Data {
  id: string;
  passengerName: string;
  passengerCount: number;
  tripCompleted: boolean;
  distance: number;
  cost: number;
  currentDate: string;
  pickupAddress: string;
  destinationAddress: string;
  accepted: boolean;
  arrived: boolean;
  canceled: boolean;
  driverName: string | null;
  history: unknown;
  feedback: number;
}

interface RowProps {
  row: Data;
}

function transformData(doc: any): Data {
  const data = doc.data();
  const currentDate = data.currentDate ? data.currentDate.toDate() : new Date();
  return {
    id: doc.id,
    passengerName: data.passengerName || '',
    passengerCount: data.passengerCount || 0,
    tripCompleted: data.tripCompleted || false,
    distance: data.distance || 0,
    cost: data.cost || 0,
    currentDate,
    pickupAddress: data.pickupAddress || '',
    destinationAddress: data.destinationAddress || '',
    accepted: data.accepted || false,
    arrived: data.arrived || false,
    canceled: data.canceled || false,
    driverName: data.driverName || null,
    history: data.history || undefined,
    feedback: data.feedback || 0,
  };
}

function Row({ row }: RowProps): React.ReactElement {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <TableRow key={`${row.id}-parent`} sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => {
              setOpen(!open);
            }}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row" style={{ textAlign: 'center' }}>
          <Typography>{row.id}</Typography>
        </TableCell>
        <TableCell align="center">
          <Typography>{row.passengerCount}</Typography>
        </TableCell>
        <TableCell align="center">
          {row.tripCompleted ? (
            <Chip label="Completed" color="success" />
          ) : (
            <Chip label="Not Completed" color="warning" />
          )}
        </TableCell>
        <TableCell align="center">
          <Typography>{row.distance !== undefined ? row.distance.toFixed(2) : '-'}</Typography>
        </TableCell>
        <TableCell align="center">
          <Typography>{row.cost !== undefined ? row.cost.toFixed(2) : '-'}</Typography>
        </TableCell>
      </TableRow>
      <TableRow key={`${row.id}-child`}>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Trip Details
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableBody>
                  <TableRow key={`${row.id}-details-passenger`}>
                    <TableCell>Passenger Name:</TableCell>
                    <TableCell>{row.passengerName}</TableCell>
                  </TableRow>
                  <TableRow key={`${row.id}-details-driver`}>
                    <TableCell>Driver Name:</TableCell>
                    <TableCell>{row.driverName}</TableCell>
                  </TableRow>
                  <TableRow key={`${row.id}-details-pickup`}>
                    <TableCell>Pickup Address:</TableCell>
                    <TableCell>{row.pickupAddress}</TableCell>
                  </TableRow>
                  <TableRow key={`${row.id}-details-destination`}>
                    <TableCell>Destination Address:</TableCell>
                    <TableCell>{row.destinationAddress}</TableCell>
                  </TableRow>
                  <TableRow key={`${row.id}-details-date`}>
                    <TableCell>Date:</TableCell>
                    <TableCell>{new Date(row.currentDate).toDateString()}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

import TablePagination from '@mui/material/TablePagination';

export function DriverTrips(): React.ReactElement {
  const [trips, setTrips] = React.useState<Data[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const searchParams = useSearchParams();
  const driverId = searchParams.get('id');

  const fetchData = async (): Promise<void> => {
    if (!driverId) return;
    setLoading(true);
    try {
      const tripsCollection = collection(db, 'trips');
      const q = query(tripsCollection, where('driverId', '==', driverId));
      const querySnapshot = await getDocs(q);
      const tripsData: Data[] = [];
      querySnapshot.forEach((doc) => {
        const trip = transformData(doc);
        tripsData.push(trip);
      });
      setTrips(tripsData);
    } catch (error) {
      setError('Error fetching data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    void fetchData();
  }, [driverId]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      {error ? (
        <Alert
          severity="error"
          onClose={() => {
            setError(null);
          }}
        >
          {error}
        </Alert>
      ) : null}
      <Card>
        <Stack sx={{ m: 2 }}>
          <Typography variant="h3">Trips</Typography>
        </Stack>
        <Divider />
        <TableContainer component={Paper}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Table aria-label="collapsible table">
              <TableHead>
                <TableRow>
                  <TableCell />
                  <TableCell align="center">Trip ID</TableCell>
                  <TableCell align="center">Passenger Count</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="center">Distance</TableCell>
                  <TableCell align="center">Cost</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {trips.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((trip) => (
                  <Row key={trip.id} row={trip} />
                ))}
              </TableBody>
            </Table>
          )}
        </TableContainer>
        <TablePagination
          component="div"
          count={trips.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </>
  );
}
