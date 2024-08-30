import {Icon} from '@chakra-ui/icons'
import {Button, useColorMode} from '@chakra-ui/react'

// eslint-disable-next-line import/no-unresolved
import FaMoon from '~icons/fa6-solid/moon'
// eslint-disable-next-line import/no-unresolved
import FaSun from '~icons/fa6-solid/sun'

const DarkMode = () => {
  const {colorMode, toggleColorMode} = useColorMode()
  return (
    <Button
      width={'3em'}
      height={'3em'}
      aria-label={'Toggle color mode'}
      onClick={toggleColorMode}
      variant={'unstyled'}
    >
      <Icon
        boxSize={'3em'}
        as={colorMode === 'light' ? FaMoon : FaSun}
        color={colorMode === 'light' ? 'black' : 'gray.400'}
      />
    </Button>
  )
}

export default DarkMode
