import { useState, useEffect } from 'react';
import { collection, doc, getDocs,  type QueryDocumentSnapshot, type QuerySnapshot } from 'firebase/firestore/lite';
import { db } from '../firebase/FirebaseConfig';

export interface Driver {
  fullName: string;
  caseNumber: string;
  vehicleNumber: string;
  contactNumber: string;
  id: string;
  avatar: string;
  name: string;
  email: string;
  address: { city: string; state: string; country: string; street: string };
  phone: string;
  createdAt: Date;
  valid: boolean;
  reject: boolean;
}

interface UseFetchDriversReturnType {
  filteredDrivers: Driver[];
  loading: boolean;
}

export const useFetchDrivers = (searchQuery: string): UseFetchDriversReturnType => {
  const [filteredDrivers, setFilteredDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDrivers = async (): Promise<void> => {
      try {
        const querySnapshot: QuerySnapshot = await getDocs(collection(db, 'drivers'));
        const driversData: Driver[] = querySnapshot.docs
          .map((docRef: QueryDocumentSnapshot) => ({ id: docRef.id, ...docRef.data() } as Driver))
          .filter((driver) =>
            driver.valid && !driver.reject && (
              driver.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
              driver.caseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
              driver.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
              driver.contactNumber.toLowerCase().includes(searchQuery.toLowerCase())
            )
          )
          .sort((a, b) => a.fullName.localeCompare(b.fullName)); // Sorting alphabetically by fullName
        setFilteredDrivers(driversData);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    void fetchDrivers();
  }, [searchQuery]);

  return { filteredDrivers, loading };
};

