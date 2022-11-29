import { onSnapshot, query, collection, orderBy, getDoc, doc, deleteDoc } from "firebase/firestore"
import { useEffect, useReducer } from "react"
import { db } from "../utils/Firebase"
import Message from "./Message"
import { ContextMenuContainer } from "./ContextMenu"

const initialState = { messages: [] }

const reducer = (state, action) => {
  switch (action.type) {
    case 'clear': {
      return { messages: [] }
    }
    case 'add': {
      return { messages: [action.data, ...state.messages] }
    }
    case 'modify': {
      let index = state.messages.findIndex((message) => message.id === action.data.id)
      let modified = state.messages.splice(index, 1, action.data)
      return { messages: modified }
    }
    case 'delete': {
      let deleted = state.messages.filter(message => message.id != action.data.id)
      return { messages: deleted }
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
      snapshot.docChanges().forEach(async(change) => {
        if (change.type === "added") {
          console.log('Added: ', change.doc.data())
          let senderData = await getSenderData(change.doc.data().senderRef.path)
          dispatch({
            type: 'add', 
            data: { 
              ...change.doc.data(), 
              id: change.doc.id,
              senderName: senderData.name,
              senderProfileIcon: senderData.photoUrl,
              senderUid: senderData.uid  
            }
          })
        }
        if (change.type === "modified") {
          console.log('Modified: ', change.doc.data())
          // dispatch({type: 'modify', data: { ...change.doc.data(), id: change.doc.id }})
        }
        if (change.type === "removed") {
          console.log('Removed: ', change.doc.data())
          dispatch({type: 'delete', data: { ...change.doc.data(), id: change.doc.id }})
        }
      })
    })

    return () => {
      try {
        unsubscribe()
      } catch (error) {}
    }
  }, [documentId])

  const getSenderData = async(path) => {
    const userDoc = await getDoc(doc(db, path))
    return userDoc.data()
  }

  const deleteMessage = async(message) => {
    try {
      await deleteDoc(doc(db, `/channels/${documentId}/messages/${message.id}`))
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="noScrollbar" id="messages">
      {state.messages.map((message) =>
        <ContextMenuContainer type="message" delete={() => { deleteMessage(message) }} key={message.id}>
          <Message key={message.messageId} data={message} uid={message.senderUid}/>
        </ContextMenuContainer>
      )}
    </div>
  )
}

export default Messages