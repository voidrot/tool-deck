import {Flex, Spacer} from '@chakra-ui/react'

import CommandPanel from '@components/CommandPanel'
import NotificationPanel from '@components/NotificationPanel'
import StatusBar from '@components/StatusBar'

function App() {
  return (
    <Flex
      flexDirection={'row'}
      height={'100vh'}
    >
      <StatusBar />
      <Spacer />
      <CommandPanel />
      <Spacer />
      <NotificationPanel />
    </Flex>
  )
}

export default App
