// WaitlistModal.js
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button, Input, useToast } from '@chakra-ui/react';
import { useState } from 'react';
import { db } from '../firebase'; // Adjust the path as necessary
import { collection, addDoc } from 'firebase/firestore';

const WaitlistModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const toast = useToast();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async () => {
    if (!email) {
      toast({
        title: "Email Required.",
        description: "Please enter a valid email address.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      // Add the email to the Firestore 'waitlist' collection
      await addDoc(collection(db, 'waitlist'), { email });
      toast({
        title: "Success!",
        description: "You've been added to the waitlist.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setEmail(''); // Clear the input field
      onClose(); // Close the modal after submission
    } catch (error) {
      console.error("Error adding document: ", error);
      toast({
        title: "Error.",
        description: "There was an error adding you to the waitlist.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Join the Waitlist</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Input
            placeholder="Enter your email"
            value={email}
            onChange={handleEmailChange}
            type="email"
          />
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={handleSubmit}>
            Submit
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default WaitlistModal;
