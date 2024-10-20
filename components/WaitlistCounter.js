"use client"
import { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase'; // Ensure the correct path to firebase config
import { Text, Box } from '@chakra-ui/react';

const WaitlistCounter = () => {
  const [waitlistCount, setWaitlistCount] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState('');

  // Function to calculate time remaining until 12 PM tomorrow
  const calculateTimeRemaining = () => {
    const now = new Date();
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 12, 0, 0); // 12 PM tomorrow
    const timeDiff = tomorrow - now;

    const hours = Math.floor((timeDiff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((timeDiff / (1000 * 60)) % 60);
    const seconds = Math.floor((timeDiff / 1000) % 60);

    return `${hours}h ${minutes}m ${seconds}s`;
  };

  useEffect(() => {
    // Waitlist counter subscription
    const waitlistCollection = collection(db, 'waitlist');
    const unsubscribe = onSnapshot(waitlistCollection, (snapshot) => {
      setWaitlistCount(snapshot.size); // Updates the count whenever the collection changes
    });

    // Timer
    const timer = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining());
    }, 1000);

    // Cleanup subscriptions when component unmounts
    return () => {
      clearInterval(timer);
      unsubscribe();
    };
  }, []);

  return (
    <Box mt={4} textAlign="center">
      <Text fontSize="lg" fontWeight="bold" color="white">
        {waitlistCount} users are waiting for our product!
      </Text>
      <Text fontSize="lg" fontWeight="bold" color="white" mt={2}>
        Time remaining until release: {timeRemaining}
      </Text>
    </Box>
  );
};

export default WaitlistCounter;
