import { useEffect, useRef, useState } from 'react'
import { PlusIcon, GlobeIcon } from '@radix-ui/react-icons'
import { addDoc, collection, doc, getDoc, where, query, updateDoc, arrayUnion, getDocs, onSnapshot, arrayRemove } from 'firebase/firestore'
import { db, storage } from '../utils/Firebase'
import { useRouter } from 'next/router'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import Tooltip from './Tooltip'
import DialogContainer from './Dialog'
import { ContextMenuContainer } from './ContextMenu'


const Rooms = () => {

  const [rooms, updateRooms] = useState([])
  const [targetRoom, setTarget] = useState()
  const editRef = useRef(null)
  const router = useRouter()

  useEffect(() => {
    const userData = JSON.parse(window.sessionStorage.getItem('userData'))
    if (userData == null) return
    const userQuery = query(collection(db, 'users'), where('__name__', '==', `${userData.docId}`))
    let unsubscribe = onSnapshot(userQuery, (snapshot) => {
      snapshot.docChanges().every(async(change) => {
        if (change.type === "added") {
          change.doc.data().rooms.forEach(async(ref) => {
            const roomSnap = await getDoc(doc(db, 'room', ref.replace('/room/', '')))
            if (!roomSnap.exists()) return
            
            updateRooms(rooms => [ ...rooms, {...roomSnap.data(), docId: roomSnap.id}])
          })
        }
        if (change.type === "modified") {
          change.doc.data().rooms.forEach(async(ref) => {
            const roomSnap = await getDoc(doc(db, 'room', ref.replace('/room/', '')))
            if (!roomSnap.exists()) return
            
            updateRooms(rooms => [ ...rooms, {...roomSnap.data(), docId: roomSnap.id}])
          })
        }
        if (change.type === "removed") {
          console.log("Removed: ", change.doc.data())
        }
      })
    })

    return () => unsubscribe()
  }, [])

  const uploadIcon = async(roomIcon, roomName) => {
    try {
      const storageRef = ref(storage, `files/rooms/roomIcons/${roomIcon.name}`)
      const uploadTask = uploadBytesResumable(storageRef, roomIcon)
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          console.log(Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          ))
        },
        (error) => console.log(error),
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async(url) => {
            createRoom(roomName, url)
          })
        }
      )
    } catch (error) {
      console.log(error)
    }
  }

  const createRoom = async (roomName, url) => {
    const channelRef = await addDoc(collection(db, 'channels'), {
      name: 'general'
    })

    const nameSubstrs = roomName.split(' ')
    let shortName = ''
    nameSubstrs.forEach((subStr) => {
      shortName += subStr.charAt(0).toUpperCase()
    })

    const uid = JSON.parse(window.sessionStorage.getItem('userData')).uid
    const roomRef = await addDoc(collection(db, "room"), {
      channels: [{
        id: `${channelRef.id}`, 
        name: 'general'
      }],
      name: roomName,
      users: [uid],
      roomIcon: url,
      shortName: shortName,
    })

    const docId = roomRef.path.replace('room/', '')
    const roomUrlQuery = query(collection(db, 'roomUrls'))
    const roomUrlSnaps = await getDocs(roomUrlQuery)
    await updateDoc(doc(db, 'roomUrls', roomUrlSnaps.docs[0].id), {
      urls: arrayUnion(`${window.location.origin}/${docId}`)
    })
    
    const userQuery = query(collection(db, 'users'), where('uid', '==', uid))
    const userSnap = await getDocs(userQuery)
    userSnap.forEach(async(snapshot) => {
      await updateDoc(doc(db, 'users', snapshot.id), {
        rooms: arrayUnion(`/${roomRef.path}`)
      })
    })
    
    router.push(`./${docId}`)
  }

  const handleClick = (event, room) => {
    console.log(room)
    window.localStorage.setItem('lastOpenedRoom', room.docId)
    router.push(`./${room.docId}`)
  }

  const handleDelete = async(room) => {
    try {
      const userData = JSON.parse(window.sessionStorage.getItem('userData'))
      const userRef = doc(db, 'users', `${userData.docId}`)
      const userDoc = await getDoc(userRef)
      console.log(userDoc.data())
      await updateDoc(userRef, {
        rooms: arrayRemove(`/room/${room.docId}`)
      })
    } catch (error) {
      console.log(error)
    }
  }

  const handleEdit = (room) => {
    setTarget(room)
    editRef.current.click()
  }

  const editRoom = async(file, name) => {
    try {
      const storageRef = ref(storage, `files/rooms/roomIcons/${file.name}`)
      const uploadTask = uploadBytesResumable(storageRef, file)
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          console.log(Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          ))
        },
        (error) => console.log(error),
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async(url) => {
            const roomRef = doc(db, "room", `${targetRoom.docId}`)
            await updateDoc(roomRef, {
              name: name,
              roomIcon: url
            })
          })
        }
      )
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div id="rooms" className="noScrollbar">
      <DialogContainer type="editRoom" submit={editRoom} room={targetRoom}>
        <button ref={editRef} style={{display: 'none'}} />
      </DialogContainer>
      {rooms.map((room, index) => (
        <div key={index}>
          <Tooltip tooltipContent={room.name}>
            <ContextMenuContainer type="room" edit={() => { handleEdit(room) }} delete={() => { handleDelete(room) }}>
              <button className="room" onClick={(event) => { handleClick(event, room) }}>
                {room.roomIcon == undefined ?
                    room.docId == 'wdmTyHNou54R1b2mgZjK' ? <GlobeIcon width={45} height={45} /> : room.shortName :
                    <img
                      src={room.roomIcon} 
                      width={'100%'} 
                      height={'100%'} 
                      alt=""
                    />
                }
              </button>
            </ContextMenuContainer>
          </Tooltip>
        </div>
      ))}
      
      <DialogContainer type="photo" submit={uploadIcon}>
        <button className="room">
          <PlusIcon width={35} height={35}/>
        </button>
      </DialogContainer>
    </div>
  )
}

export default Rooms