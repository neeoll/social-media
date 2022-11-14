import { doc, getDoc } from "firebase/firestore"
import { useEffect, useState } from "react"
import { db } from "../utils/Firebase"
import { useRouter } from "next/router"
import { GlobeIcon } from "@radix-ui/react-icons"
import styles from '../styles/Components.module.css'
import Image from "next/image"

export const Invite = ({ url }) => {

  const [roomData, setRoomData] = useState({})
  const [joined, setJoined] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const docId = url.split('/')[3]

    const getRoomData = async() => {
      const roomSnap = await getDoc(doc(db, 'room', docId))
      if (!roomSnap.exists()) return
      
      const roomData = { 
        ...roomSnap.data(),
        docId: roomSnap.id,
        userCount: roomSnap.data().users.length
      }
      
      setRoomData(roomData)
    }
    const checkJoined = async() => {
      const userData = JSON.parse(window.sessionStorage.getItem('userData'))
      const rooms = userData.rooms
      if (rooms.includes(`/room/${docId}`)) {
        setJoined(true)
      }
    }

    getRoomData()
    checkJoined()
  }, [url])

  const handleClick = () => {
    router.push(url)
  }

  return(
    <>
      {roomData != {} && (
        <div className={styles.Invite}>
          {roomData.roomIcon == undefined ? 
            roomData.docId = 'wdmTyHNou54R1b2mgZjK' ? <GlobeIcon width={65} height={65} /> : roomData.shortName :
            <Image 
              style={{
                borderRadius: 20
              }}
              src={roomData.roomIcon}
              width={65}
              height={65} 
              alt=""
            />
          }
          <div className={styles.RoomData}>
            <span>{roomData.name}</span>
            <span>{roomData.userCount} Member{roomData.userCount > 1 || roomData.userCount == 0 && 's'}</span>
          </div>
          <button className={joined == true ? 'inactive' : 'save'} onClick={handleClick}>{joined == true ? 'Joined' : 'Join'}</button>
        </div>
      )}
    </>
  )
}

export default Invite