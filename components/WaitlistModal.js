import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Button,
    Input,
    useToast,
    Text,
    Icon,
  } from '@chakra-ui/react';
  import { useState } from 'react';
  import { db } from '../firebase'; // Ensure the correct path to firebase config
  import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
  import { CheckIcon } from '@chakra-ui/icons'; // Importing CheckIcon
  
  const WaitlistModal = ({ isOpen, onClose }) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false); // State to track submission
    const toast = useToast();
  
    // Simple email validation
    const isValidEmail = (email) => {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regex.test(email);
    };
  
    const handleEmailChange = (e) => {
      setEmail(e.target.value);
    };
  
    const handleSubmit = async () => {
      if (!isValidEmail(email)) {
        toast({
          title: "Invalid email.",
          description: "Please enter a valid email address.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }
      
      setLoading(true);
      try {
        const waitlistCollection = collection(db, 'waitlist');
        const q = query(waitlistCollection, where('email', '==', email));
        const querySnapshot = await getDocs(q);
  
        if (!querySnapshot.empty) {
          toast({
            title: "Email already on the waitlist.",
            description: "You have already joined the waitlist.",
            status: "info",
            duration: 3000,
            isClosable: true,
          });
        } else {
          await addDoc(waitlistCollection, { email });
          setSubmitted(true); // Set submitted state to true
        }
      } catch (error) {
        console.error("Error adding email to waitlist: ", error);
        toast({
          title: "Error.",
          description: `There was an error joining the waitlist: ${error.message}`,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
        setEmail(''); // Clear the email input after submission
      }
    };
  
    return (
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Join the Waitlist</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {submitted ? ( // Conditional rendering based on submission state
              <Text textAlign="center" fontSize="lg" color="green.500">
                <Icon as={CheckIcon} color="green.500" mr={2} />
                You have been put on the waitlist!
              </Text>
            ) : (
              <Input
                placeholder="Enter your email"
                value={email}
                onChange={handleEmailChange}
                type="email"
                required
              />
            )}
          </ModalBody>
          <ModalFooter>
            {!submitted && ( // Only show the submit button if not submitted
              <Button
                colorScheme="blue"
                onClick={handleSubmit}
                isLoading={loading}
                disabled={loading}
              >
                Submit
              </Button>
            )}
            <Button variant="ghost" onClick={onClose} ml={3}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  };
  
  export default WaitlistModal;
  