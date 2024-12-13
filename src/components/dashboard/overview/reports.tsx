'use client';
import React, { useEffect, useState } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Link from '@mui/material/Link';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { collection, getDocs } from 'firebase/firestore/lite';
import { db } from '../firebase/FirebaseConfig';
import { paths } from '@/paths';


interface Report {
  caseNumber: string;
  fullName: string;
  reportReason: string;
  reportedAt: string;
  vehicleNumber: string;
}

export function Reports(): React.ReactElement {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchReports = async () => {
      const reportedDriversRef = collection(db, 'reportedDrivers');

      try {
        // Fetch reportedDrivers
        const reportedDriversQuerySnapshot = await getDocs(reportedDriversRef);
        const reportedDriversData = reportedDriversQuerySnapshot.docs.map((doc) => ({
          caseNumber: doc.data().caseNumber,
          fullName: doc.data().fullName,
          reportReason: doc.data().reportReason,
          reportedAt: doc.data().reportedAt.toDate().toString(), // Convert timestamp to string
          vehicleNumber: doc.data().vehicleNumber,
        }));

        console.log('Fetched reportedDrivers:', reportedDriversData); // Debug log

        setReports(reportedDriversData);
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
      <Link href={paths.dashboard.reports} style={{ textDecoration: 'none', color: 'inherit' }}><CardHeader title="Reported Drivers"/></Link>
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
                      <Typography>{report.fullName}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <div>
                        <Typography variant="body2" color="textSecondary">
                          Case Number: {report.caseNumber}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Report Reason: {report.reportReason}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Reported At: {report.reportedAt}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Vehicle Number: {report.vehicleNumber}
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
