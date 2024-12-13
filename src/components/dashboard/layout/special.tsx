'use client';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore/lite';
import { db } from '../firebase/FirebaseConfig';
import { FormControl, FormGroup, FormControlLabel, Switch, TextField } from '@mui/material';
import { useEffect, useState } from 'react';

export function Special(): React.ReactElement {
  const [activate, setActivate] = useState<boolean>(false);
  const [price, setPrice] = useState<number>(0);
  const [docId, setDocId] = useState<string>('current');

  useEffect(() => {
    const fetchData = async () => {
      const specialPriceCollection = collection(db, 'specialPrice');
      const specialPriceSnapshot = await getDocs(specialPriceCollection);
      specialPriceSnapshot.forEach((doc) => {
        const data = doc.data();
        setActivate(data.activate);
        setPrice(data.price);
      });
    };
    fetchData();
  }, []);

  const handleToggle = async () => {
    const newActivate = !activate;
    setActivate(newActivate);
    await updateDoc(doc(db, 'specialPrice', docId), { activate: newActivate });
  };

  const handlePriceChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPrice = Number(event.target.value);
    setPrice(newPrice);
    await updateDoc(doc(db, 'specialPrice', docId), { price: newPrice });
  };

  return (
    <FormControl component="fieldset">
      <FormGroup aria-label="position">
        <FormControlLabel
          value="top"
          control={<Switch checked={activate} onChange={handleToggle} />}
          label={`Special Trips - Price: ₱${price}`}
          labelPlacement="start"
        />
        <TextField
          type="text"
          value={price}
          onChange={handlePriceChange}
          variant="standard"
          inputProps={{ min: 0 }}
          sx={{ my: 1, color: 'white', '& .MuiInputBase-input': { color: 'white' } }}
        />
      </FormGroup>
    </FormControl>
  );
}
