import { useEffect, useRef, useState } from 'react'
import { PlusIcon } from '@radix-ui/react-icons'
import { collection, where, query, onSnapshot, doc, updateDoc, arrayRemove } from 'firebase/firestore'
import { db } from '../utils/Firebase'
import { ContextMenuContainer } from './ContextMenu'
import DialogContainer from './Dialog'

const Channels = ({docId, activeChannel, setChannel}) => {

  const [channels, updateChannels] = useState([])
  const [targetChannel, setTarget] = useState()
  const editRef = useRef(null)

  useEffect(() => {
    if (docId == '') return
    let channelsQuery = query(collection(db, 'room'), where('__name__', '==', `${docId}`))
    let unsubscribe = onSnapshot(channelsQuery, (snapshot) => {
      snapshot.docChanges().every(async (change) => {
        if (change.type === "added") {
          updateChannels(change.doc.data().channels)
          console.log("Added: ", change.doc.data())
        }
        if (change.type === "modified") {
          updateChannels(change.doc.data().channels)
          console.log("Modified: ", change.doc.data())
        }
        if (change.type === "removed") {
          console.log("Removed: ", change.doc.data())
        }
      })
    })

    return () => unsubscribe()
  }, [docId])

  const changeChannel = (id) => {
    setChannel(id)
  }

  const handleDelete = async (channel) => {
    try {
      console.log(channel.id)
      let channelsRef = doc(db, 'room', `${docId}`)
      await updateDoc(channelsRef, {
        channels: arrayRemove(channel)
      })
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="noScrollbar">
      {channels.map((channel) => (
        <ContextMenuContainer type="channel" delete={() => { handleDelete(channel) }} edit={() => { handleEdit(channel) }} key={channel.id}>
          <button
            className="channel"
            onClick={() => {
              changeChannel(channel.id)
            }}
            key={channel.id}
          >
            {channel.name}
          </button>
        </ContextMenuContainer>
      ))}
    </div>
  )
}

export default Channels