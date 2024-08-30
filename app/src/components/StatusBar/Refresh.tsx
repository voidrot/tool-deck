import {Icon} from '@chakra-ui/icons'
import {Button, useColorMode} from '@chakra-ui/react'

// eslint-disable-next-line import/no-unresolved
import FaArrowsRotate from '~icons/fa6-solid/arrows-rotate'

const Refresh = () => {
  const {colorMode} = useColorMode()
  return (
    <Button
      width={'3em'}
      height={'3em'}
      aria-label={'Toggle color mode'}
      onClick={() => {
        window.location.reload()
      }}
      border={'none'}
      variant={'unstyled'}
    >
      <Icon
        boxSize={'3em'}
        as={FaArrowsRotate}
        color={colorMode === 'light' ? 'black' : 'gray.400'}
      />
    </Button>
  )
}

export default Refresh
