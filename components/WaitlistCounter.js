"use client"
import { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase'; // Ensure the correct path to firebase config
import { Text, Box } from '@chakra-ui/react';

const WaitlistCounter = () => {
  const [waitlistCount, setWaitlistCount] = useState(0);

  useEffect(() => {
    const waitlistCollection = collection(db, 'waitlist');
    
    // Use onSnapshot to listen to real-time updates
    const unsubscribe = onSnapshot(waitlistCollection, (snapshot) => {
      setWaitlistCount(snapshot.size); // Updates the count whenever the collection changes
    });

    // Cleanup the subscription when component unmounts
    return () => unsubscribe();
  }, []); // Runs only once when the component mounts

  return (
    <Box mt={4}>
      <Text fontSize="lg" fontWeight="bold" color="white">
        {waitlistCount} users are waiting for our product!
      </Text>
    </Box>
  );
};

export default WaitlistCounter;
