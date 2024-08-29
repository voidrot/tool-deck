import {Flex, Tab, TabList, TabPanel, TabPanels, Tabs} from '@chakra-ui/react'

import CommandButton from './Command.tsx'

const CommandButtons = () => {
  return (
    <Flex
      width={'100%'}
      padding={'1em'}
      height={'100%'}
    >
      <Tabs
        isFitted
        width={'100%'}
        height={'100%'}
        align={'center'}
        size={'lg'}
        variant={'soft-rounded'}
      >
        <TabList width={'50%'}>
          <Tab>One</Tab>
          <Tab>Two</Tab>
          <Tab>Thre</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <CommandButton />
          </TabPanel>
          <TabPanel></TabPanel>
          <TabPanel></TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  )
}

export default CommandButtons
