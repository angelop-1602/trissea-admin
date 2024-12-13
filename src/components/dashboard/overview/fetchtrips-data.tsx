import { collection, getDocs, Timestamp } from 'firebase/firestore/lite';
import { db } from '../firebase/FirebaseConfig';

interface FirestoreData {
  id: string;
  passengerName: string;
  passengerCount: number;
  tripCompleted: boolean;
  distance: number;
  cost: number;
  currentDate: Timestamp | null;
  pickupAddress: string;
  destinationAddress: string;
  accepted: boolean;
  arrived: boolean;
  canceled: boolean;
  driverName: string | null;
  history: any; // Change this to the appropriate type if known
  arrivedToFinalDestination: boolean; // Ensure this property is included
  started: boolean;
}

interface Data extends Omit<FirestoreData, 'currentDate'> {
  started: boolean;
  currentDate: string | null;
}

export async function FetchTripsData(selectedDate: string): Promise<Data[]> {
  try {
    const fetchCollection = async (colName: string): Promise<Data[]> => {
      const tripsSnapshot = await getDocs(collection(db, colName));
      return tripsSnapshot.docs.map(doc => {
        const data = doc.data() as FirestoreData;
        const currentDate: string | null = data.currentDate ? data.currentDate.toDate().toISOString().split('T')[0] : null;
        return {
          ...data,
          currentDate,
        } as Data;
      });
    };

    const collections = ['trips', 'todaTrips'];
    const allTripsData = await Promise.all(collections.map(col => fetchCollection(col)));
    const allTrips = allTripsData.flat();

    const filteredTrips = allTrips.filter(trip => trip.currentDate === selectedDate);

    const sortedTrips = filteredTrips.sort((a, b) => {
      const dateA = new Date(a.currentDate || '');
      const dateB = new Date(b.currentDate || '');
      return dateA.getTime() - dateB.getTime();
    });

    return sortedTrips;
  } catch (error) {
    console.error('Error fetching trips data:', error);
    throw error; // or handle it more specifically if needed
  }
}
