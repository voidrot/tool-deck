import {
  Box,
  Button,
  Code,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Icon,
  useColorMode,
  useDisclosure
} from '@chakra-ui/react'
import {invoke} from '@tauri-apps/api/core'
import {useEffect, useRef, useState} from 'react'

// eslint-disable-next-line import/no-unresolved
import SettingsIcon from '~icons/fa6-solid/gear'

const Settings = () => {
  const {colorMode} = useColorMode()
  const {isOpen, onOpen, onClose} = useDisclosure()
  const btnRef = useRef()
  const [ipAddress, setIpAddress] = useState<string>('Loading...')

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     invoke('get_local_ip').then(res => {
  //       if (typeof res === 'string') {
  //         setIpAddress(res)
  //       } else {
  //         setIpAddress('Error')
  //       }
  //     })
  //   }, 10000)
  //   return () => clearInterval(interval)
  // }, [setIpAddress])

  // @ts-ignore
  return (
    <Box>
      <Button
        width={'3em'}
        height={'3em'}
        variant={'unstyled'}
        aria-label={'Settings'}
        // @ts-ignore
        ref={btnRef}
        onClick={isOpen ? onClose : onOpen}
        border={'none'}
      >
        <Icon
          boxSize={'3em'}
          color={colorMode === 'light' ? 'black' : 'gray.400'}
          as={SettingsIcon}
          focusable={false}
        />
      </Button>
      <Drawer
        isOpen={isOpen}
        placement='right'
        onClose={onClose}
        size='sm'
        // @ts-ignore
        finalFocusRef={btnRef}
        useInert={true}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Tool Deck System Info</DrawerHeader>

          <DrawerBody>
            <h1>
              Local IP Address: <Code>{ipAddress}</Code>
            </h1>
          </DrawerBody>

          <DrawerFooter></DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Box>
  )
}

export default Settings
