import {Icon} from '@chakra-ui/icons'
import {Box, Center} from '@chakra-ui/react'
import {useEffect, useState} from 'react'
import {CpuInfo, cpuInfo, refreshCpu} from 'tauri-plugin-system-info-api'
import * as v from 'valibot'

// eslint-disable-next-line import/no-unresolved
import FaMicrochip from '~icons/fa6-solid/microchip'

const CPU = () => {
  const [cpuUsage, setCpuUsage] = useState<number>()
  const [cpuColor, setCpuColor] = useState<string>('green')

  useEffect(() => {
    const interval = setInterval(async () => {
      // @ts-ignore
      await refreshCpu()
      // @ts-ignore
      const cpuRes: CpuInfo = v.parse(CpuInfo, await cpuInfo())
      let cpuUsage = 0
      for (const cpu in cpuRes.cpus) {
        const c = cpuRes.cpus[cpu]
        cpuUsage += c.cpu_usage
      }
      cpuUsage /= cpuRes.cpu_count
      const cpuPercent = parseFloat(cpuUsage.toFixed(2))
      if (cpuPercent > 80) {
        setCpuColor('red')
      } else if (cpuPercent > 60) {
        setCpuColor('yellow')
      } else {
        setCpuColor('green')
      }
      setCpuUsage(cpuPercent)
    }, 5000)
    return () => clearInterval(interval)
  }, [setCpuUsage, setCpuColor])

  return (
    <Box>
      <Icon
        boxSize={'3em'}
        as={FaMicrochip}
        color={cpuColor}
      />
      <Center>
        <p>{cpuUsage}%</p>
      </Center>
    </Box>
  )
}

export default CPU
