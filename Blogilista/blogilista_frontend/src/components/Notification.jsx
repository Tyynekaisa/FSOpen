import { Alert } from '@mui/material'

const ErrorNotification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <Alert
      style={{ marginTop: 10, marginBottom: 10 }}
      severity='error'
    >
      {message}
    </Alert>
  )
}

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <Alert
      style={{ marginTop: 10, marginBottom: 10 }}
      severity='success'
    >
      {message}
    </Alert>
  )
}

export { Notification, ErrorNotification }
