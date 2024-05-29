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
import { collection, getDocs, query, where } from 'firebase/firestore/lite';
import { db } from '../firebase/FirebaseConfig';
import { paths } from '@/paths';

interface Terminal {
  id: string;
  name: string;
  location: string;
  cost: number;
  // Add more properties as needed
}

export function TodaTable(): React.ReactElement {
  const [terminals, setTerminals] = useState<Terminal[]>([]);
  const router = useRouter();

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



  return (
    <Card>
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: '800px' }}>
          <TableHead>
            <TableRow>
              <TableCell align="center">Terminal Name</TableCell>
              <TableCell align="center">Location</TableCell>
              <TableCell align="center">Rate</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {terminals.map((terminal) => (
              <TableRow key={terminal.id} hover>
                <TableCell>
                  <Typography align="center">{terminal.name}</Typography>
                </TableCell>
                <TableCell align="center">{terminal.location}</TableCell>
                <TableCell align="center">{terminal.cost}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
      <Divider />
    </Card>
  );
}
