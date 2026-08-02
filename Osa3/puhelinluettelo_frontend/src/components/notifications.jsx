const ErrorNotification = ({ message }) => {
    const errorStyle = {
        color: 'red',
        background: 'lightgrey',
        fontSize: 20,
        border: '2px solid red',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10
    }

    if (message === null) {
        return null
    }

    return (
        <div style={errorStyle}>
        {message}
        </div>
    )
}

const Notification = ({ message }) => {
    const notificationStyle = {
        color: 'green',
        background: 'lightgrey',
        fontSize: 20,
        border: '2px solid green',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10
    }

  if (message === null) {
    return null
  }

  return (
    <div style={notificationStyle}>
      {message}
    </div>
  )
}

export { Notification, ErrorNotification }