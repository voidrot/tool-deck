import {Flex, Spacer} from '@chakra-ui/react'

import Refresh from '@components/StatusBar/Refresh.tsx'

import Agent from './Agent.tsx'
import CPU from './CPU.tsx'
import Memory from './Memory.tsx'
import Settings from './Settings.tsx'

const StatusBar = () => {
  return (
    <Flex
      alignItems={'center'}
      flexDirection={'column'}
      justifyContent={'center'}
      alignContent={'center'}
      justifyItems={'center'}
      align={'center'}
      textAlign={'center'}
      height={'100%'}
      width={'5em'}
      bgColor={'transparent'}
      paddingTop={'2em'}
      paddingBottom={'2em'}
      paddingLeft={'0.25em'}
    >
      <Agent />
      <Spacer />
      <CPU />
      <Spacer />
      <Memory />
      <Spacer />
      <Refresh />
      <Spacer />
      <Settings />
    </Flex>
  )
}

export default StatusBar
