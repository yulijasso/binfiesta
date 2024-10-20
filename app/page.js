import Head from 'next/head'
import { Box, Flex } from '@chakra-ui/react'
import HeroSection from '@/components/HeroSection'
import WithSubnavigation from '@/components/HomeNav'
import WaitlistCounter from '@/components/WaitlistCounter'
import Chat from '@/components/Chat' // Import the Chat component

export default function Home() {
  return (
    <>
      <Head>
        <title>Bin Fiesta</title>
        <meta name="description" content="Welcome to Bin Fiesta" />
      </Head>
      <Flex
        direction="column"
        align="center"
        justify="center"
        minH="100vh"
        bgGradient="linear(to-r, black, blue.400)"
        color="white"
        textAlign="center"
        overflow="hidden"
      >
        <Box flex="1" w="full">
          <WithSubnavigation />
          <Box mt={12}>
            <HeroSection />
            <WaitlistCounter />
            <Chat /> {/* Add the Chat component */}
          </Box>
        </Box>
      </Flex>
    </>
  )
}