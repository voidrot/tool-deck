import {extendTheme} from '@chakra-ui/react'
import {mode} from '@chakra-ui/theme-tools'

const theme = extendTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false
  },
  styles: {
    global: (props: any) => ({
      body: {
        color: mode('black', 'white')(props),
        bg: mode('white', 'black')(props)
      }
    })
  }
})

export {theme}
