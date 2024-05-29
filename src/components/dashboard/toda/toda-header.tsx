'use client';

import * as React from 'react';
import { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar';
import SnackbarContent from '@mui/material/SnackbarContent'; // Import SnackbarContent
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { collection, doc, getFirestore, setDoc } from 'firebase/firestore';

export function TodaHeader(): React.ReactElement {
  const [open, setOpen] = useState(false);
  const [Terminalname, setTerminalName] = useState('');
  const [todaLocation, setTodaLocation] = useState('');
  const [todaCost, setTodaCost] = useState('');

  const firestore = getFirestore(); // Initialize Firestore

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAddToda = async () => {
    try {
      await setDoc(doc(collection(firestore, 'terminals'), Terminalname), {
        name: Terminalname,
        location: todaLocation,
        cost: todaCost,
      });
      setTerminalName('');
      setTodaLocation('');
      setTodaCost('');
      handleClose();
    } catch (error) {
      console.error('Error adding Toda: ', error);
      // Handle error if necessary
    }
  };

  return (
    <Card elevation={3}>
      <Stack sx={{ p: 2 }} direction="row" alignItems="center" justifyContent="space-between">
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            sx={{ maxWidth: '500px', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)' }}
            onClick={handleOpen}
          >
            <b>Add Toda</b>
          </Button>
        </Stack>
      </Stack>
      <Snackbar open={open} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <SnackbarContent
          sx={{ background: 'white', color: 'black' }} // Apply custom styling here
          message={
            <>
              <TextField
                autoComplete="off"
                label="Toda Name"
                value={Terminalname}
                onChange={(e) => {
                  setTerminalName(e.target.value);
                }}
                variant="outlined"
                margin="dense"
              />
              <TextField
                autoComplete="off"
                label="Toda Location"
                value={todaLocation}
                onChange={(e) => {
                  setTodaLocation(e.target.value);
                }}
                variant="outlined"
                margin="dense"
              />
              <TextField
                autoComplete="off"
                label="Toda Cost"
                value={todaCost}
                onChange={(e) => {
                  setTodaCost(e.target.value);
                }}
                variant="outlined"
                margin="dense"
              />
              <Button onClick={handleAddToda}>Add</Button>
              <Button onClick={handleClose}>Cancel</Button>
              <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </>
          }
        />
      </Snackbar>
    </Card>
  );
}
