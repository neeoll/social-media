import PasswordResetDialog from "./PasswordResetDialog"

export const RoomHeader = ({ data, createChannel }) => {

  const dispatch = (channelName) => {
    createChannel(channelName)
  }

  return (
    <div style={{
      display: 'flex',
      gap: 10,
      padding: 5,
      alignItems: 'center'
    }}>
      <span>{data}</span>
      <PasswordResetDialog confirm={dispatch}>
        <button>Create Channel</button>
      </PasswordResetDialog>
    </div>
  )
}

export default RoomHeader