import {Icon} from '@chakra-ui/icons'
import {Box, Text} from '@chakra-ui/react'

// eslint-disable-next-line import/no-unresolved
import FaWifi from '~icons/fa6-solid/wifi'

const Agent = () => {
  return (
    <Box>
      <Icon
        boxSize={'3em'}
        as={FaWifi}
        color={'green'}
      />
      <Text fontSize={'sm'}>Connected</Text>
    </Box>
  )
}

export default Agent
