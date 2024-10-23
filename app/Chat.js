"use client";

import React, { useState } from "react";
import { Box, Button, Flex, Heading, Input, VStack, Text } from "@chakra-ui/react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ChatHistory from "../components/ChatHistory"; // Assuming you have a separate component for chat history
import Loading from "../components/Loading"; // Assuming you have a loading spinner component



const App = () => {


  const [userInput, setUserInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isChatVisible, setIsChatVisible] = useState(false);

  const genAI = new GoogleGenerativeAI("AIzaSyCBMB5iF6WAokgY84vf0sm97fahMz2wwvw"); // Update with your actual API key
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });



  const handleUserInput = (e) => {
    setUserInput(e.target.value);
  };

const sendMessage = async () => {
  if (userInput.trim() === "") return;
  setIsLoading(true);

  try {
      let responseText;

      // Check for greeting messages
      const greetings = ["hello", "hi", "hey"];
      if (greetings.includes(userInput.trim().toLowerCase())) {
          responseText = "Hello there! How can I help you today? 😊";
      } 
      // Check for specific questions and provide concise answers
      else {
          const lowerCaseInput = userInput.toLowerCase().trim(); // Normalize input

          // Inline FAQ information
          if (lowerCaseInput.includes("what is bin fiesta")) {
            responseText = "Bin Fiesta is an innovative recycling app that helps you identify whether an item can be recycled by simply uploading an image. We also offer the option to locate the nearest recycle centers based on their current location. Protecting our planet starts with you! 🌎♻️";
        } else if (lowerCaseInput.includes("how does bin fiesta work")) {
            responseText = "You take a picture of an item, and Bin Fiesta analyzes it to determine if it can be recycled, providing tips for proper disposal.";
        } else if (lowerCaseInput.includes("is bin fiesta free")) {
            responseText = "Yes, Bin Fiesta is free to use for everyone.";
        } else if (lowerCaseInput.includes("do i need an account")) {
            responseText = "No account is necessary for basic features. In the near future, we plan to add the option to create profiles to allow you to track your recycling habits and earn rewards.";
        } else if (lowerCaseInput.includes("how accurate is bin fiesta")) {
            responseText = "Bin Fiesta uses advanced image recognition and a regularly updated database to ensure accuracy.";
        } else if (lowerCaseInput.includes("can bin fiesta provide recycling information for my location")) {
            responseText = "Yes, Bin Fiesta can offer localized recycling information and guidelines based on your location to help you recycle correctly.";
        } else if (lowerCaseInput.includes("what should i do if bin fiesta cannot recognize an item")) {
            responseText = "If Bin Fiesta cannot recognize an item, you can submit feedback to help improve our image recognition technology by contacting our customer support, binfiesta.support@gmail.com.";
        } else if (lowerCaseInput.includes("what types of items can i scan")) {
            responseText = "You can scan a wide range of items, including plastics, metals, paper, and cardboard. Bin Fiesta is constantly updating its database to include more materials.";
        } else if (lowerCaseInput.includes("is my personal information safe")) {
            responseText = "Yes, Bin Fiesta takes user privacy seriously. We do not share your personal information with third parties without your consent.";
        } else if (lowerCaseInput.includes("what are the future plans for bin fiesta")) {
            responseText = "We plan to introduce more features, such as gamification elements, community challenges, and partnerships with local recycling centers to enhance user engagement and promote sustainable practices.";
        } 
        // Respond with the AI model for unrecognized terms
          else {
          
              try {
                const prompt = `You are an interactive chatbot that answers questions about Bin Fiesta, a photo-based recycling app. You should provide accurate information about the app's features, recycling practices, and disposal tips. If you don't know the answer, apologize and inform the user to send an email to binfiesta.support@gmail.com for further support. User: ${userInput} Bot:`;

                  const result = await model.generateContentStream(prompt);
                  let aiResponse = '';

                  for await (const chunk of result.stream) {
                      aiResponse += chunk.text();
                  }
                  
                  responseText = aiResponse; // Set responseText to the final AI response
              } catch (aiError) {
                  console.error("Error in AI response:", aiError);
                  responseText = "Sorry, I couldn't process that request. Please contact support, binfiesta.support@gmail.com.";
              }
          }
      }

      // Update the chat history with the response
      setChatHistory(prevHistory => [
          ...prevHistory,
          { type: "user", message: userInput },
          { type: "bot", message: responseText || "I'm sorry, I couldn't understand that." }, // Fallback message
      ]);
      
  } catch (error) {
      console.error("Error sending message:", error);
      setChatHistory(prevHistory => [
          ...prevHistory,
          { type: "bot", message: "Sorry, there was an error processing your request." },
      ]);
  } finally {
      setUserInput("");
      setIsLoading(false);
  }
};



  const clearChat = () => {
    setChatHistory([]);
  };

  const toggleChatVisibility = () => {
    setIsChatVisible(!isChatVisible);
  };

  const ChatBubble = ({ type, message }) => (
    <Flex
      bg={type === "user" ? "green.400" : "blue.400"}
      color="white"
      p={4}
      mb={3}
      rounded="lg"
      maxWidth="80%"
      flexDirection="column"
      textAlign="left"
    >
      <Text fontWeight="bold">{type === "user" ? "You" : "Bot"}</Text>
      <Text fontSize="md">{message}</Text>
    </Flex>
  );

  return (
    <>
      <Button
        position="fixed"
        bottom="10px"
        right="10px"
        bg="green.400"
        color="white"
        p={6}
        rounded="full"
        shadow="lg"
        onClick={toggleChatVisibility}
      >
        {isChatVisible ? "Hide Chat" : "Support Chat"}
      </Button>

      {isChatVisible && (
        <Box
          position="fixed"
          bottom="70px"
          right="10px"
          bg="black"
          color="white"
          p={6}
          rounded="lg"
          shadow="lg"
          width="90%"
          maxWidth="400px"
          maxHeight="500px"
          overflow="auto"
        >
          <VStack spacing={4} align="stretch">
            <Heading as="h1" size="md" textAlign="center">
              Support Chat
            </Heading>

            <Box
              bg="gray.800"
              p={4}
              rounded="md"
              shadow="sm"
              color="white"
              maxHeight="300px"
              overflowY="auto"
            >
              {chatHistory.map((chat, index) => (
                <ChatBubble key={index} type={chat.type} message={chat.message} />
              ))}
              <Loading isLoading={isLoading} />
            </Box>

            <Flex>
              <Input
                placeholder="Type your message..."
                value={userInput}
                onChange={handleUserInput}
                onKeyDown={(e) => (e.key === 'Enter' ? sendMessage() : null)}
                flex="1"
                mr={2}
                bg="gray.700"
                color="white"
              />
              <Button
                colorScheme="green"
                onClick={sendMessage}
                isLoading={isLoading}
              >
                Send
              </Button>
            </Flex>

            <Button onClick={clearChat} colorScheme="gray" size="sm">
              Clear Chat
            </Button>
          </VStack>
        </Box>
      )}
    </>
  );
};

export default App;