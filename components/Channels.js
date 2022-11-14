import { useEffect, useState } from 'react'
import { PlusIcon } from '@radix-ui/react-icons'
import { collection, where, query, onSnapshot } from 'firebase/firestore'
import { db } from '../utils/Firebase'


const Channels = ({docId, activeChannel, setChannel}) => {

  const [channels, updateChannels] = useState([])

  useEffect(() => {
    if (docId == undefined) return
    let channelsQuery = query(collection(db, 'room'), where('__name__', '==', `${docId}`))
    let unsubscribe = onSnapshot(channelsQuery, (snapshot) => {
      console.log(snapshot)
      snapshot.docChanges().every(change => {
        if (change.type === "added") {
          updateChannels(change.doc.data().channels)
        }
        if (change.type === "modified") {
          let newChannel = change.doc.data().channels[change.doc.data().channels.length - 1]
          updateChannels(channels => [newChannel, ...channels])
        }
        if (change.type === "removed") {
          console.log("Removed: ", change.doc.data())
        }
      })
    })

    return () => unsubscribe()
  }, [docId])

  const changeChannel = (id) => {
    const messageDocId = id.replace('/messages/', '')
    setChannel(messageDocId)
  }

  return (
    <div className="noScrollbar">
      {channels.map((channel, index) => (
        <button
          className="channel"
          onClick={() => {
            changeChannel(channel.id)
          }}
          key={channel.id}
        >
          {channel.name}
        </button>
      ))}
    </div>
  )
}

export default Channels