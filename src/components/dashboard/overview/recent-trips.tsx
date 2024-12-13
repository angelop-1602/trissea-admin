'use client';

import * as React from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';
import { CardHeader, Divider, Card, Link } from '@mui/material';

import { FetchTripsData } from './fetchtrips-data';
import { TripHeader } from './trips-header';
import { paths } from '@/paths';

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
  arrivedToFinalDestination: boolean;
  started: boolean;
}

interface RowProps {
  row: Data;
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
          {row.accepted && !row.canceled && row.tripCompleted && row.arrivedToFinalDestination ? (
            <Chip label="Completed" color="primary" />
          ) : row.accepted && !row.arrived && !row.canceled ? (
            <Chip label="Ongoing" color="info" />
          ) : (
            <Chip label="Canceled" color="error" />
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
                    <TableCell>
                      <Typography>{row.currentDate}</Typography>
                    </TableCell>
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

export function RecentTrips(): React.ReactElement {
  const [trips, setTrips] = React.useState<Data[]>([]);
  const [selectedDate, setSelectedDate] = React.useState<string>(dayjs().format('YYYY-MM-DD'));
  const [error, setError] = React.useState<string | null>(null);
  const [page, setPage] = React.useState(0); // Page should start at 0
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [selectedStatus, setSelectedStatus] = React.useState<string | null>(null);

  React.useEffect(() => {
    setSelectedStatus('Ongoing');
  }, []);

  const handleDateChange = (date: dayjs.Dayjs | null): void => {
    if (date) {
      setSelectedDate(date.format('YYYY-MM-DD'));
    }
  };

  const handleFilterChange = (status: string | null): void => {
    setSelectedStatus(status);
  };

  const fetchData = async (date: string, status: string): Promise<void> => {
    try {
      const tripsData = await FetchTripsData(date);
      const filteredTrips = tripsData.filter((trip) => {
        if (status === 'Ongoing') {
          return trip.accepted && !trip.canceled && !trip.tripCompleted;
        } else if (status === 'Completed') {
          return trip.accepted && trip.arrivedToFinalDestination && trip.tripCompleted;
        } else if (status === 'Canceled') {
          return trip.canceled;
        }
        return false;
      });
      const sortedTrips = filteredTrips.sort((a, b) => {
        if (a.tripCompleted && !b.tripCompleted) return -1;
        if (!a.tripCompleted && b.tripCompleted) return 1;
        if (dayjs(a.currentDate).isBefore(dayjs(b.currentDate))) return -1;
        if (dayjs(a.currentDate).isAfter(dayjs(b.currentDate))) return 1;
        return 0;
      });
      setTrips(sortedTrips.map(trip => ({
        ...trip,
        currentDate: trip.currentDate || '',
        arrivedToFinalDestination: trip.arrivedToFinalDestination as boolean,
        started: trip.started || false  // Ensure 'started' is always set as boolean
      })));      
    } catch (fetchError) {
      setError('Error fetching data.');
    }
  };

  React.useEffect(() => {
    if (selectedDate && selectedStatus) {
      void fetchData(selectedDate, selectedStatus);
    }
  }, [selectedDate, selectedStatus]);

  const handleChangePage = (event: unknown, newPage: number): void => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <Card>
      <Link href={paths.dashboard.recenttrips} style={{ textDecoration: 'none', color: 'inherit' }}><CardHeader title="Trips" /> </Link>
        <Divider />
        <TripHeader onDateChange={handleDateChange} onFilterChange={handleFilterChange} />
        <TableContainer component={Paper}>
          {error ? (
            <Alert severity="error">{error}</Alert>
          ) : (
            <>
              <Table aria-label="collapsible table">
                <TableHead>
                  <TableRow>
                    <TableCell />
                    <TableCell align="center">Trip Id</TableCell>
                    <TableCell align="center">Passenger/s</TableCell>
                    <TableCell align="center">Status</TableCell>
                    <TableCell align="center">Distance (km)</TableCell>
                    <TableCell align="center">Cost (₱)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {trips.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((trip) => (
                    <Row key={trip.id} row={trip} />
                  ))}
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={trips.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </>
          )}
        </TableContainer>
      </Card>
    </>
  );
}
