import DialogContainer from "./Dialog"

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
      <DialogContainer type="channel" submit={dispatch}>
        <button>Create Channel</button>
      </DialogContainer>
    </div>
  )
}

export default RoomHeader