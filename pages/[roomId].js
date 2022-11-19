import { useState, useEffect, useRef } from "react";
import { db, storage } from '../utils/Firebase'
import { Timestamp, updateDoc, addDoc, doc, getDoc, getDocs, query, collection, arrayUnion } from 'firebase/firestore'
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { getGlobalAuth, logout } from "../utils/AuthManager";
import { useRouter } from "next/router";

import MessageInput from "../components/MessageInput";
import ProgressBar from "../components/ProgressBar";
import JoinRoomDialog from "../components/JoinRoomDialog";
import Messages from "../components/Messages";
import UserModule from "../components/UserModule";
import RoomHeader from "../components/RoomHeader";
import Rooms from "../components/Rooms";
import Channels from "../components/Channels";

export const getServerSideProps = async(context) => {
  const query = context.query

  return {
    props: {
      data: query
    }
  }
}

export default function Room({ data }) {
  const [messagesDocId, updateDocId] = useState('')
  const [roomDocId, setRoomDocId] = useState()
  const [roomName, setRoomName] = useState('')
  const [file, setFile] = useState()
  const [filename, setFilename] = useState('')
  const [percent, setPercent] = useState(null)
  const [currentUploadTask, setUploadTask] = useState()
  const joinRoomRef = useRef(null)

  const router = useRouter()

  const checkRooms = (roomId) => {
    const userData = JSON.parse(window.sessionStorage.getItem('userData'))
    if (userData == null) return
    if (userData.rooms.includes(`/room/${roomId}`)) return
    joinRoomRef.current.click()
  }
  
  const getRoomData = async(roomId) => {
    setRoomDocId(roomId)
    try {
      const roomSnap = await getDoc(doc(db, 'room', roomId))
      if (!roomSnap.exists()) return 
      setRoomName(roomSnap.data().name)
      updateDocId(roomSnap.data().channels[0].id)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    const checkAuth = () => {
      const authGlobal = getGlobalAuth()
      if (authGlobal.currentUser == null) {
        router.push('../')
      }
    }

    checkAuth()
    checkRooms(data.roomId)
    getRoomData(data.roomId)
  }, [data.roomId, router])

  function generateId(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
  }

  const checkIfInvite = async(contents) => {
    const roomUrlsQuery = query(collection(db, 'roomUrls'))
    const roomUrlsSnaps = await getDocs(roomUrlsQuery)
    const urls = roomUrlsSnaps.docs[0].data().urls
    if (urls.includes(contents)) {
      return true
    } else {
      return false
    }
  }

  const submit = async(e, textData) => {
    e.preventDefault()
    try {
      const messagesRef = collection(db, `/channels/${messagesDocId}/messages/`)
      const senderData = JSON.parse(window.sessionStorage.getItem('userData'))
      const isInvite = await checkIfInvite(textData)
      if (file) {
        await handleUpload(messagesRef, textData, senderData, isInvite)
      } else {
        await addDoc(messagesRef, {
          attachment: '',
          contents: textData,
          createdAt: Timestamp.now().seconds,
          isInvite: isInvite,
          senderName: senderData.name,
          senderProfileIcon: senderData.photoUrl,
          senderUid: senderData.uid,
        })
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleUpload = async(messagesRef, textData, senderData, isInvite) => {
    setFilename(file.name)
    const storageRef = ref(storage, `/files/${data.roomId}/${file.name}`)
    const uploadTask = uploadBytesResumable(storageRef, file);
    setUploadTask(uploadTask)
    uploadTask.on(
      'state_changed', 
      (snapshot) => {
        setPercent(Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        ))
      },
      (error) => console.log(error),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async(url) => {
          let newImg = new Image()
          newImg.src = url
          newImg.onload = async() => {
            await addDoc(messagesRef, {
              attachment: {
                height: newImg.height,
                src: url,
                width: newImg.width,
              },
              contents: textData,
              createdAt: Timestamp.now().seconds,
              isInvite: isInvite,
              senderName: senderData.name,
              senderProfileIcon: senderData.photoUrl,
              senderUid: senderData.uid,
            })

            setPercent(null)
          }
        })
      }
    )
  }

  const createChannel = async(channelName) => {
    const messagesRef = await addDoc(collection(db, "messages"), {
      messages: []
    })

    const roomRef = doc(db, 'room', data.roomId)
    await updateDoc(roomRef, {
      channels: arrayUnion({id: `/${messagesRef.path}`, name: channelName})
    })
  }

  const cancelUpload = () => {
    try {
      currentUploadTask.cancel()
      console.log("task cancelled")
      setPercent(null)
    } catch (error) {
      console.log(error)
    }
  }

  const signOut = () => {
    logout()
    router.push('./')
  }

  return (
    <div className="card" id="home">
      <JoinRoomDialog roomDocId={data.roomId}>
        <button ref={joinRoomRef} style={{display: 'none'}}/>
      </JoinRoomDialog>
      <Rooms />
      <div className="channels">
        <RoomHeader data={roomName} createChannel={createChannel}/>
        <Channels docId={roomDocId} activeChannel={messagesDocId} setChannel={updateDocId}/>
        <UserModule data={window.sessionStorage.getItem('userData')}/>
      </div>
      <div className="contents">
        <Messages documentId={messagesDocId} /> 
        <div>
          {percent != null && <ProgressBar cancelUpload={cancelUpload} filename={filename} progress={percent} />}
          <MessageInput submit={submit} updateFile={setFile}>Message...</MessageInput>
        </div>
      </div>
      <button className="cancel" onClick={signOut}>Logout</button>
    </div>
  );
}