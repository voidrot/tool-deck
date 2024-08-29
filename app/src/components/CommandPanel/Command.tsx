import {Icon} from '@chakra-ui/icons'
import {Box, Button, Card, CardBody, Stack, Text} from '@chakra-ui/react'

// eslint-disable-next-line import/no-unresolved
import FaTerminal from '~icons/fa6-solid/terminal'

const CommandButton = () => {
  return (
    <Button
      variant={'unstyled'}
      height={'10em'}
      width={'10em'}
      margin={'1em'}
    >
      <Card
        width={'10em'}
        height={'10em'}
      >
        <CardBody
          justifyContent={'center'}
          alignContent={'center'}
        >
          <Stack
            overflow={'hidden'}
            justifyContent={'center'}
            alignContent={'center'}
            alignItems={'center'}
            justifyItems={'center'}
            textAlign={'center'}
          >
            <Icon
              as={FaTerminal}
              boxSize={'2em'}
            />
            <Box padding={'0.5em'}>
              <Text>Test</Text>
            </Box>
          </Stack>
        </CardBody>
      </Card>
    </Button>
  )
}

export default CommandButton
