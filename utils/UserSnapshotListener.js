import { collection, onSnapshot, query, where } from "firebase/firestore"
import { db } from "./Firebase"

export const UserSnapshotListener = (userDocId) => {
  const userQuery = query(collection(db, 'users'), where('__name__', '==', `${userDocId}`))
  return () => onSnapshot(userQuery, (snapshot) => {
    snapshot.docChanges().every((change) => {
      if (change.type === "added") {
        window.sessionStorage.setItem('userData', JSON.stringify({...change.doc.data(), docId: userDocId}))
      }
      if (change.type === "modified") {
        window.sessionStorage.setItem('userData', JSON.stringify({...change.doc.data(), docId: userDocId}))
      }
    })
  })
}