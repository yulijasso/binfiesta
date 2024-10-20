'use client';

import { useState, useRef, useEffect } from "react";
import { 
  Box, 
  Button, 
  Input, 
  Image as ChakraImage, 
  Text, 
  Spinner, 
  VStack, 
  HStack, 
  Wrap, 
  WrapItem, 
  Alert, 
  AlertIcon 
} from "@chakra-ui/react";
import Link from "next/link";
import dynamic from "next/dynamic";

// Dynamically import the WaitlistModal so it only loads on the client
const WaitlistModal = dynamic(() => import('../../components/WaitlistModal'), { ssr: false });

const AnalyzePage = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [analysisResult, setAnalysisResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cameraMode, setCameraMode] = useState(false);
  const [photoCaptured, setPhotoCaptured] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  const [isClient, setIsClient] = useState(false); // Check if it's running on the client

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Modal open/close handlers
  const handleModalOpen = () => setIsModalOpen(true);
  const handleModalClose = () => setIsModalOpen(false);

  // Ensure that the code runs only on the client
  useEffect(() => {
    setIsClient(true); // This ensures modals and other dynamic components load only on the client
  }, []);

  // Function to resize the image
  const resizeImage = (file, maxWidth = 512, maxHeight = 512) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new window.Image();
        img.src = event.target.result;

        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height = Math.floor((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.floor((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
          resolve(dataUrl);
        };

        img.onerror = () => reject(new Error("Failed to load image"));
      };

      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const resizedImage = await resizeImage(file);
      setSelectedImage(resizedImage);
      setPhotoCaptured(false);
      setAnalysisResult([]);
      setError(null);
    } catch (err) {
      setError("Failed to resize image. Please try again.");
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) {
      alert("Please upload an image first.");
      return;
    }

    setLoading(true);
    setError(null);
    setAnalysisResult([]);

    try {
      const base64Image = selectedImage.split(",")[1];
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ base64Image }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const data = await response.json();
      if (data.result) {
        const parsedResult = JSON.parse(data.result.replace(/```json|```/g, ""));
        if (parsedResult.result && Array.isArray(parsedResult.result)) {
          setAnalysisResult(parsedResult.result);
        } else {
          setError("Unexpected response format from API.");
        }
      } else {
        setError("No result found in API response.");
      }
    } catch (error) {
      setError("Failed to analyze image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const startCamera = () => {
    setCameraMode(true);
    setPhotoCaptured(false);
    setAnalysisResult([]);
    setError(null);

    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
      })
      .catch(() => {
        setError("Failed to access camera. Please try again.");
        setCameraMode(false);
      });
  };

  const captureImage = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
    setSelectedImage(dataUrl);
    setPhotoCaptured(true);
    stopCamera();
  };

  const stopCamera = () => {
    const stream = videoRef.current.srcObject;
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraMode(false);
  };

  const retryCapture = () => {
    setSelectedImage(null);
    setPhotoCaptured(false);
    setAnalysisResult([]);
    setError(null);
    startCamera();
  };

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgGradient="linear(to-r, black, blue.500)"
      color="white"
      p={6}
      position="relative"
    >
      {/* Floating Home Button */}
      <Link href="/" passHref>
        <Button
          as="a" // Render the button as an anchor tag directly
          position="absolute"
          top={4}
          left={4}
          bg="white"
          color="black"
          _hover={{ bg: "gray.200" }}
        >
          Home
        </Button>
      </Link>

      {/* Floating Waitlist Button */}
      <Button
        position="absolute"
        top={4}
        right={4}
        bg="green.400"
        color="white"
        _hover={{ bg: "green.300" }}
        onClick={handleModalOpen} // Open the modal
      >
        Waitlist
      </Button>

      {/* Floating App Name in the Center */}
      <Text
        position="absolute"
        top={4}
        left="50%"
        transform="translateX(-50%)"
        fontSize="lg"
        fontWeight="bold"
        color="white"
      >
        Bin Fiesta ♻️
      </Text>

      <Box
        bg="whiteAlpha.200"
        p={8}
        borderRadius="lg"
        boxShadow="lg"
        maxW="lg"
        w="full"
        textAlign="center"
      >
        <VStack spacing={6}>
          <Text fontSize="3xl" fontWeight="bold" color="white">
            Detect Recyclable Items
          </Text>
          <Text fontSize="lg" color="whiteAlpha.800">
            Upload an image of trash or use your camera to detect recyclable items.
          </Text>

          <label htmlFor="file-upload">
            <Button as="span" colorScheme="blue" w="full" mb={4}>
              Upload Image
            </Button>
          </label>
          <Input
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            display="none"
          />

          {cameraMode ? (
            <Box>
              <video ref={videoRef} autoPlay style={{ maxWidth: "100%", borderRadius: "8px" }} />
              <canvas ref={canvasRef} width="512" height="512" style={{ display: "none" }} />

              <HStack spacing={4} mt={4}>
                <Button colorScheme="teal" onClick={captureImage}>
                  Capture Image
                </Button>
                <Button colorScheme="red" onClick={stopCamera}>
                  Stop Camera
                </Button>
              </HStack>
            </Box>
          ) : (
            <Button colorScheme="blue" onClick={startCamera}>
              Use Camera
            </Button>
          )}

          {selectedImage && (
            <Box mb={4} borderRadius="lg" overflow="hidden" boxShadow="md">
              <ChakraImage src={selectedImage} alt="Selected Image" maxH="300px" />
              {photoCaptured && (
                <Button mt={4} colorScheme="yellow" onClick={retryCapture}>
                  Retry Photo
                </Button>
              )}
            </Box>
          )}

          <Button
            size="lg"
            colorScheme="teal"
            onClick={analyzeImage}
            isDisabled={!selectedImage || loading}
            _hover={{ bg: "teal.400" }}
            w="full"
          >
            {loading ? <Spinner size="md" /> : "Analyze Image"}
          </Button>

          {loading && (
            <Box mt={4}>
              <Spinner size="lg" />
            </Box>
          )}

          {error && (
            <Alert status="error" mt={4}>
              <AlertIcon />
              {error}
            </Alert>
          )}

          {Array.isArray(analysisResult) && analysisResult.length > 0 && (
            <Box
              mt={4}
              p={4}
              bg="whiteAlpha.300"
              borderRadius="lg"
              w="full"
              textAlign="center"
              boxShadow="md"
            >
              <Text fontSize="lg" fontWeight="bold" color="white" mb={2}>
                Analysis Result:
              </Text>
              <Wrap justify="center" spacing={3}>
                {analysisResult.map((item, index) => (
                  <WrapItem key={index}>
                    <Box
                      bg="teal.600"
                      color="white"
                      px={4}
                      py={2}
                      borderRadius="full"
                      fontWeight="bold"
                      boxShadow="md"
                    >
                      {item}
                    </Box>
                  </WrapItem>
                ))}
              </Wrap>
            </Box>
          )}
        </VStack>
      </Box>

      {/* Waitlist Modal */}
      {isClient && (
        <WaitlistModal isOpen={isModalOpen} onClose={handleModalClose} />
      )}
    </Box>
  );
};

export default AnalyzePage;
