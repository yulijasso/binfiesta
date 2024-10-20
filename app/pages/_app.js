// pages/_app.js
import { ChakraProvider } from "@chakra-ui/react";

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;


// where you setup ChakraProvider
import { ChakraProvider, extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  styles: {
    global: {
      // Global styles for the body
      body: {
        color: "black", // Ensure a default color
        bg: "white",   // Background can adjust based on your layout needs
      },
    },
  },
});