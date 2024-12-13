'use client';
import React, { useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/navigation';
import { collection, getDocs, query, where, doc, updateDoc } from 'firebase/firestore/lite';
import { db } from '../firebase/FirebaseConfig';
import { paths } from '@/paths';
import { Modal } from '@mui/material';
import { makeStyles } from '@mui/styles';
import TextField from '@mui/material/TextField';

interface Terminal {
  id: string;
  name: string;
  location: string;
  cost: number;
  // Add more properties as needed
}

const useStyles = makeStyles((theme) => ({
  modalBox: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    backgroundColor: 'white',
    border: '2px solid #000',
    padding: 20,
    borderRadius: '8px',
  },
  tableCell: {
    textAlign: 'center',
  },
  input: {
    width: '80px',
    textAlign: 'center',
  },
}));

export function TodaTable(): React.ReactElement {
  const classes = useStyles();
  const [terminals, setTerminals] = useState<Terminal[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedTerminal, setSelectedTerminal] = useState<Terminal | null>(null);
  const [tempCost, setTempCost] = useState<number | null>(null);
  const router = useRouter();
  const [isEditing, setIsEditing] = useState<{ [key: string]: boolean }>({}); // Track editing state for each terminal

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      const terminalsCollection = collection(db, 'terminals'); // Changed collection name to 'terminals'

      const querySnapshot = await getDocs(terminalsCollection);
      const fetchedTerminals: Terminal[] = [];
      querySnapshot.forEach((doc) => {
        fetchedTerminals.push({ id: doc.id, ...doc.data() } as Terminal);
      });
      setTerminals(fetchedTerminals);
    };

    void fetchData();
  }, []);

  const handleRateChange = (terminal: Terminal, newRate: number) => {
    setTempCost(newRate);
    setSelectedTerminal(terminal);
  };

  const handleConfirmUpdate = async () => {
    if (selectedTerminal && tempCost !== null) {
      const terminalRef = doc(db, 'terminals', selectedTerminal.id);
      await updateDoc(terminalRef, { cost: tempCost });

      setTerminals((prevTerminals) =>
        prevTerminals.map((terminal) =>
          terminal.id === selectedTerminal.id ? { ...terminal, cost: tempCost } : terminal
        )
      );
      setOpen(false);
      setSelectedTerminal(null);
      setTempCost(null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && selectedTerminal) {
      setOpen(true);
    }
  };

  return (
    <Card>
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: '800px' }}>
          <TableHead>
            <TableRow>
              <TableCell className={classes.tableCell}>Terminal Name</TableCell>
              <TableCell className={classes.tableCell}>Location</TableCell>
              <TableCell className={classes.tableCell}>Rate</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {terminals.map((terminal) => (
              <TableRow key={terminal.id} hover>
                <TableCell className={classes.tableCell}>
                  <Typography>{terminal.name}</Typography>
                </TableCell>
                <TableCell className={classes.tableCell}>{terminal.location}</TableCell>
                <TableCell className={classes.tableCell}>
                  <TextField
                    type="number"
                    value={tempCost !== null && selectedTerminal?.id === terminal.id ? tempCost : terminal.cost}
                    onChange={(e) => handleRateChange(terminal, Number(e.target.value))}
                    onKeyPress={handleKeyPress}
                    className={classes.input}
                    disabled={!isEditing[terminal.id]} // Disable input unless in edit mode
                    variant="outlined"
                    size="small"
                    InputProps={{
                      style: { textAlign: 'center' },
                    }}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      if (isEditing[terminal.id]) {
                        // If already in edit mode, open the modal
                        setOpen(true);
                      } else {
                        // If not in edit mode, enable editing
                        setIsEditing((prev) => ({ ...prev, [terminal.id]: true }));
                        setSelectedTerminal(terminal);
                        setTempCost(terminal.cost); // Set tempCost to current cost for editing
                      }
                    }}
                    style={{ marginLeft: '8px' }}
                  >
                    {isEditing[terminal.id] ? 'Confirm' : 'Change'}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
      <Divider />
      
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box className={classes.modalBox}>
          <Typography variant="h6" gutterBottom>Confirm Update</Typography>
          <Typography>Are you sure you want to update the rate to {tempCost}?</Typography>
          <Box display="flex" justifyContent="space-between" marginTop={2}>
            <Button variant="contained" color="primary" onClick={handleConfirmUpdate}>Confirm</Button>
            <Button variant="outlined" color="secondary" onClick={() => setOpen(false)}>Cancel</Button>
          </Box>
        </Box>
      </Modal>
    </Card>
  );
}

