'use client';
import React, { useEffect, useState } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { collection, getDocs } from 'firebase/firestore/lite';
import { db } from '../firebase/FirebaseConfig';

interface Report {
  passengerName: string;
  driverName: string;
  reportComment: string;
  index: number;
}

export function Reports(): React.ReactElement {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchReports = async () => {
      const tripsRef = collection(db, 'trips');
      const todayTripsRef = collection(db, 'todayTrips');

      try {
        // Fetch trips
        const tripsQuerySnapshot = await getDocs(tripsRef);
        const tripsData = tripsQuerySnapshot.docs.map((doc) => doc.data() as Report);

        // Fetch todayTrips
        const todayTripsQuerySnapshot = await getDocs(todayTripsRef);
        const todayTripsData = todayTripsQuerySnapshot.docs.map((doc) => doc.data() as Report);

        // Concatenate trips and todayTrips
        const allReports = [...tripsData, ...todayTripsData];

        // Filter reports with reportComment
        const reportsWithComment = allReports.filter(report => report.reportComment);

        setReports(reportsWithComment);
      } catch (error) {
        console.error('Error fetching reports:', error);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchReports();
  }, []);

  return (
    <Card>
      <CardHeader title="Reports"/>
      <Accordion>
        <div style={{ maxHeight: '38rem', overflowY: 'auto', width: '100%' }}>
          {isLoading ? (
            <Typography style={{ padding: '10px' }}>Loading...</Typography>
          ) : reports.length === 0 ? (
            <Typography style={{ padding: '15px' }}>No reports available.</Typography>
          ) : (
            reports.map((report, index) => (
              <div key={index} style={{ marginBottom: 10 }}>
                <Divider />
                <div>
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography>{report.driverName}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <div>
                        <Typography variant="body2" color="textSecondary">
                          Passenger: {report.passengerName}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Comment: {report.reportComment}
                        </Typography>
                      </div>
                    </AccordionDetails>
                  </Accordion>
                </div>
              </div>
            ))
          )}
        </div>
      </Accordion>
    </Card>
  );
}
