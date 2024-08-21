import {Icon} from '@chakra-ui/icons'
import {Button, useColorMode} from '@chakra-ui/react'

// eslint-disable-next-line import/no-unresolved
import FaPowerOff from '~icons/fa6-solid/power-off'

const QuitApp = () => {
  const {colorMode} = useColorMode()

  const quitApp = () => {
    console.log('quit app')
    // window.statusApi.quitApp()
  }

  return (
    <Button
      id={'quit-app-btn'}
      width={'3em'}
      height={'3em'}
      aria-label={'Toggle color mode'}
      variant={'unstyled'}
      onClick={quitApp}
    >
      <Icon
        boxSize={'3em'}
        as={FaPowerOff}
        color={colorMode === 'light' ? 'black' : 'gray.400'}
      />
    </Button>
  )
}

export default QuitApp
