import React, { useState, useEffect } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import StarIcon from '@mui/icons-material/Star';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Card,
  CardContent,
  Divider,
  Grid,
  Stack,
  Typography,
  Pagination,
} from '@mui/material';
import { collection, getDocs, query, where } from 'firebase/firestore/lite';

import { db } from '../../firebase/FirebaseConfig';

export function DriverReview(): React.ReactElement {
  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(1);
  const reviewsPerPage = 5; // Number of reviews to display per page

  useEffect(() => {
    const fetchReviews = async () => {
      const tripsCollection = collection(db, 'trips');
      const todaTripsCollection = collection(db, 'todaTrips');

      const tripsSnapshot = await getDocs(tripsCollection);
      const tripsData = tripsSnapshot.docs.map(doc => doc.data());

      const todaTripsSnapshot = await getDocs(todaTripsCollection);
      const todaTripsData = todaTripsSnapshot.docs.map(doc => doc.data());

      const allReviewsData = [...tripsData, ...todaTripsData];
      setReviews(allReviewsData);
    };
    void fetchReviews();
  }, []);

  const [expanded, setExpanded] = useState<string | false>('');

  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const indexOfLastReview = page * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  return (
    <Card variant="outlined">
      <Stack sx={{ m: 2 }}>
        <Typography variant="h3">Reviews</Typography>
      </Stack>
      <Divider />
      <CardContent>
        {currentReviews.map((review, index) => (
          <Accordion
            key={index}
            expanded={expanded === `review${index}`}
            onChange={handleChange(`review${index}`)}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ fontSize: 40 }} />}
              aria-controls={`review${index}-content`}
              id={`review${index}-header`}
            >
              <Grid container alignItems="center">
                <Grid item xs={6}>
                  <Typography variant="h6">{review.passengerName}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Stack direction="row" alignItems="center" justifyContent="flex-end">
                    <StarIcon htmlColor="#FFD700" />
                    <Typography variant="subtitle1" color="text.secondary">
                      {review.feedback}/5
                    </Typography>
                  </Stack>
                </Grid>
              </Grid>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Comments:
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {review.comment}
                  </Typography>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        ))}
      </CardContent>
      <Grid container justifyContent="center" sx={{ my: 2 }}>
        <Pagination
          count={Math.ceil(reviews.length / reviewsPerPage)}
          page={page}
          onChange={handlePageChange}
          siblingCount={1}
          boundaryCount={1}
          color="primary"
          variant="outlined"
          shape="rounded"
        />
      </Grid>
    </Card>
  );
}
