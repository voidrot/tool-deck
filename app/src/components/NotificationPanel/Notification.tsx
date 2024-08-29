import {Box, Card, CardBody} from '@chakra-ui/react'

export type Notification = {
  title: string
  body: string
  id: number
}

const Notification = ({notification}: {notification: Notification}) => {
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {title, body, id} = notification

  return (
    <Box width={'100%'}>
      <Card width={'100%'}>
        <CardBody>
          <h2>{title}</h2>
          <p>{body}</p>
        </CardBody>
      </Card>
    </Box>
  )
}

export default Notification
