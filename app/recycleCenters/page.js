// get user's location if they allow it 
// check for nearest recycle center 
// get nearest recycle centers
// display nearest recycle centers 
// when user clicks on recycle center option --> take them to Google maps 



import WithSubnavigation from '@/components/HomeNav'

import {  Text, Flex, Box } from '@chakra-ui/react'

export default function RecycleCenters() {
  return (
    <>
      <Flex
        direction="column"
        align="center"
        justify="flex-start"  
        w="100vw"
        minH="100vh"
        bgGradient="linear(to-r, black, blue.700)"
        color="white"
        textAlign="center"
        overflow="hidden" 
        pt={12} 
      >
        <Box w="full"> 
          <WithSubnavigation />
        </Box>
        
        <Text 
        fontSize="2xl"
        mt={16}
        >
                
          Recycle Centers Near Me
        </Text>      
        
        </Flex>
    </>
  );
}
