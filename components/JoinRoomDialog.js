import * as Dialog from '@radix-ui/react-dialog'
import { Cross2Icon } from "@radix-ui/react-icons"
import { useEffect } from 'react'
import { db } from '../utils/Firebase'
import { doc, getDoc } from 'firebase/firestore'
import { useState } from 'react'
import { useRouter } from 'next/router'
import styles from '../styles/Components.module.css'

const JoinRoomDialog = ({ roomDocId, children }) => {

  const [roomData, setRoomData] = useState()
  const router = useRouter()

  useEffect(() => {
    const getRoomData = async() => {
      const roomSnap = await getDoc(doc(db, 'room', roomDocId))
      if (!roomSnap.exists()) return
      setRoomData(roomSnap.data())
    }

    getRoomData()
  }, [roomDocId])

  const joinRoom = () => {
    console.log('joined')
  }

  const cancelJoin = () => {
    router.push(`./${window.localStorage.getItem('lastOpenedRoom')}`)
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        {children}
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.DialogOverlay}>
          <Dialog.Content className={styles.DialogContent} id={styles.join}>
            {roomData && 
              <>
                <span>{roomData.name}</span>
                <span>{roomData.users.length} Member{roomData.users.length > 1 && 's'}</span>
                <div>
                  <button className="save" onClick={joinRoom}>Join</button>
                  <Dialog.Close asChild>
                    <button className="cancel" onClick={cancelJoin}>Cancel</button>
                  </Dialog.Close>
                </div>
              </>
            }
            <Dialog.Close asChild>
              <button className="icon">
                <Cross2Icon height={20} width={20} />
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export default JoinRoomDialog