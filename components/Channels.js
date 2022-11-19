import { useEffect, useState } from 'react'
import { PlusIcon } from '@radix-ui/react-icons'
import { collection, where, query, onSnapshot, doc, updateDoc, arrayRemove } from 'firebase/firestore'
import { db } from '../utils/Firebase'
import ChannelContextMenu from './ChannelContextMenu'
import styles from '../styles/Components.module.css'

const Channels = ({docId, activeChannel, setChannel}) => {

  const [channels, updateChannels] = useState([])

  useEffect(() => {
    if (docId == undefined) return
    let channelsQuery = query(collection(db, 'room'), where('__name__', '==', `${docId}`))
    let unsubscribe = onSnapshot(channelsQuery, (snapshot) => {
      snapshot.docChanges().every(change => {
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
      {channels.map((channel, index) => (
        <ChannelContextMenu className={styles.contextMenu} delete={() => { handleDelete(channel) }}>
          <button
            className="channel"
            onClick={() => {
              changeChannel(channel.id)
            }}
            key={channel.id}
          >
            {channel.name}
          </button>
        </ChannelContextMenu>
      ))}
    </div>
  )
}

export default Channels