import { onSnapshot, query, where, collection } from "firebase/firestore"
import React, { useEffect, useState } from "react"
import { db } from "../utils/Firebase"
import Message from "./Message"

export const Messages = ({ documentId }) => {
  const [messages, updateMessages] = useState([])

  useEffect(() => {
    if (documentId == '') return
    const blockedUsers = JSON.parse(window.sessionStorage.getItem('userData')).blockedUsers
    let messagesQuery = query(collection(db, 'messages'), where('__name__', '==', `${documentId}`))
    let unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      snapshot.docChanges().every(change => {
        if (change.type === "added") {
          updateMessages(change.doc.data().messages.reverse())
        }
        if (change.type === "modified") {
          let newMessage = change.doc.data().messages[change.doc.data().messages.length - 1]
          if (blockedUsers.includes(newMessage.senderUid)) return false
          updateMessages(messages => [newMessage, ...messages])
        }
        if (change.type === "removed") {
          console.log("Removed: ", change.doc.data())
        }
      })
    })
    return () => unsubscribe()
  }, [documentId])

  return (
    <div className="noScrollbar" id="messages">
      {messages.map((message) =>
        <Message key={message.messageId} data={message} uid={message.from}/>
      )}
    </div>
  )
}

export default Messages