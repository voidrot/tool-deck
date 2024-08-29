import {Icon} from '@chakra-ui/icons'
import {Box, Center} from '@chakra-ui/react'
import {useEffect, useState} from 'react'
import {MemoryInfo, memoryInfo, refreshMemory} from 'tauri-plugin-system-info-api'
import * as v from 'valibot'

// eslint-disable-next-line import/no-unresolved
import FaMemory from '~icons/fa6-solid/memory'

const Memory = () => {
  const [memUsage, setMemUsage] = useState<string>()
  const [memColor, setMemColor] = useState<string>('green')
  useEffect(() => {
    const interval = setInterval(async () => {
      await refreshMemory()
      // @ts-ignore
      const memRes: MemoryInfo = v.parse(MemoryInfo, await memoryInfo())
      const memPercent = ((memRes.used_memory / memRes.total_memory) * 100).toFixed(2)
      if (parseFloat(memPercent) > 85) {
        setMemColor('red')
      } else if (parseFloat(memPercent) > 70) {
        setMemColor('yellow')
      } else {
        setMemColor('green')
      }
      setMemUsage(memPercent)
    }, 5000)
    return () => clearInterval(interval)
  }, [setMemUsage, setMemColor])

  return (
    <Box>
      <Icon
        boxSize={'3em'}
        as={FaMemory}
        color={memColor}
      />
      <Center>
        <p>{memUsage}%</p>
      </Center>
    </Box>
  )
}

export default Memory
