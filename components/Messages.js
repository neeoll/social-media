import { onSnapshot, query, where, collection, orderBy, doc } from "firebase/firestore"
import React, { useEffect, useReducer, useState } from "react"
import { db } from "../utils/Firebase"
import Message from "./Message"

const initialState = { messages: [] }

const reducer = (state, action) => {
  switch (action.type) {
    case 'clear': {
      return { messages: [] }
    }
    case 'add': {
      state.messages.splice(0, 0, action.data)
      return { messages: state.messages }
    }
    case 'modify': {
      let index = state.messages.findIndex((message) => message.id === action.data.id)
      state.messages.splice(index, 1, action.data)
      return { messages: state.messages }
    }
    case 'delete': {
      const filtered = state.messages.filter(message => message.id != action.data.id)
      return { messages: filtered }
    }
    default: {
      throw new Error()
    }
  }
}

export const Messages = ({ documentId }) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    if (documentId == '') return
    dispatch({type: 'clear'})
    let messageCollection = query(collection(db, `/channels/${documentId}/messages`), orderBy('createdAt', 'asc'))
    let unsubscribe = onSnapshot(messageCollection, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          console.log('Added: ', change.doc.data())
          dispatch({type: 'add', data: { ...change.doc.data(), id: change.doc.id }})
        }
        if (change.type === "modified") {
          console.log('Modified: ', change.doc.data())
          dispatch({type: 'modify', data: { ...change.doc.data(), id: change.doc.id }})
        }
        if (change.type === "removed") {
          console.log('Removed: ', change.doc.data())
          dispatch({type: 'delete', data: { ...change.doc.data(), id: change.doc.id }})
        }
      })
    })

    return () => unsubscribe()
  }, [documentId])

  return (
    <div className="noScrollbar" id="messages">
      {state.messages.map((message) =>
        <Message key={message.messageId} data={message} uid={message.from}/>
      )}
    </div>
  )
}

export default Messages