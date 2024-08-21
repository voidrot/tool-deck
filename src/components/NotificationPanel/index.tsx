import {Box, Flex, Text, VStack} from '@chakra-ui/react'

const NotificationPanel = () => {
  const notifications = []
  return (
    <Flex
      width={'30%'}
      height={'100%'}
      paddingTop={'1em'}
      paddingBottom={'0.5em'}
      paddingRight={'0.25em'}
    >
      <VStack
        align={notifications.length > 0 ? 'left' : 'center'}
        justify={notifications.length > 0 ? 'left' : 'center'}
        overflowY={'auto'}
        maxHeight={'100%'}
        width={'100%'}
        style={{scrollbarWidth: 'none'}}
        borderRadius={'1em'}
        border={'1px clear'}
      >
        <Box>
          <Text>No notifications!</Text>
        </Box>
      </VStack>
    </Flex>
  )
}

export default NotificationPanel
