import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { CircularProgress, OutlinedInput } from '@mui/material';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import { collection, getDocs, query, where } from 'firebase/firestore/lite';

import { db } from '../firebase/FirebaseConfig';

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
  history: string[];
  feedback: string | number;
}

interface RowProps {
  row: Data;
}

function transformData(doc: firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>): Data {
  const data = doc.data() as Record<string, unknown>;
  const currentDate = data.currentDate ? (data.currentDate as Date).toDate() : new Date();

  const trip: Data = {
    id: doc.id,
    passengerName: data.passengerName ? (data.passengerName as string) : '',
    passengerCount: data.passengerCount !== undefined ? (data.passengerCount as number) : 0,
    tripCompleted: Boolean(data.tripCompleted),
    distance: data.distance !== undefined ? (data.distance as number) : 0,
    cost: data.cost !== undefined ? (data.cost as number) : 0,
    currentDate: currentDate.toLocaleString(),
    pickupAddress: data.pickupAddress ? (data.pickupAddress as string) : '',
    destinationAddress: data.destinationAddress ? (data.destinationAddress as string) : '',
    accepted: Boolean(data.accepted),
    arrived: Boolean(data.arrived),
    canceled: Boolean(data.canceled),
    driverName: data.driverName ? (data.driverName as string) : null,
    history: data.history ? (data.history as string[]) : [],
    feedback: data.feedback !== undefined ? (data.feedback as string | number) : 0,
  };

  return trip;
}
function Row({ row }: RowProps): React.ReactElement {
  const [open, setOpen] = useState(false);

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
                    <TableCell>{row.currentDate}</TableCell>
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

export function PassengerTrip(): React.ReactElement {
  const [trips, setTrips] = useState<Data[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const searchParams = useSearchParams();
  const passengerId = searchParams.get('id');

  const fetchData = async (): Promise<void> => {
    if (!passengerId) return;
    setLoading(true);
    try {
      const tripsCollection = collection(db, 'trips');
      const q = query(tripsCollection, where('passengerId', '==', passengerId));
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

  useEffect(() => {
    void fetchData();
  }, [passengerId]);

  // Function to filter trips based on search query
  const filteredTrips = trips.filter((trip) => trip.id.toLowerCase().includes(searchQuery.toLowerCase()));

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
        <Stack sx={{ p: 2 }} direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h3">Passenger trips</Typography>
          <OutlinedInput
            fullWidth
            placeholder="Search Trip ID"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
            }}
            startAdornment={
              <InputAdornment position="end">
                <MagnifyingGlassIcon fontSize="var(--icon-fontSize-md)" />
              </InputAdornment>
            }
            sx={{ maxWidth: '500px', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)' }}
          />
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
                {filteredTrips.map((trip) => (
                  <Row key={trip.id} row={trip} />
                ))}
              </TableBody>
            </Table>
          )}
        </TableContainer>
      </Card>
    </>
  );
}
