import * as Dialog from "@radix-ui/react-dialog"
import { Cross2Icon } from "@radix-ui/react-icons"
import styles from '../styles/Components.module.css'
import { useEffect, useRef, useState } from "react"
import ImageCropper from "./ImageCropper"
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage"
import { db, storage } from "../utils/Firebase"
import { updateDoc, doc } from "firebase/firestore"
import { useRouter } from "next/router"

export const DialogContainer = (props) => {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        {props.children}
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.DialogOverlay}>
          { props.type == "emailPassword" && <EmailPasswordContent submit={props.submit} /> }
          { props.type == "passwordReset" && <PasswordResetContent submit={props.submit} /> }
          { props.type == "photo" && <PhotoContent submit={props.submit} /> }
          { props.type == "settings" && <SettingsContent /> }
          { props.type == "cropper" && <CropperContent submit={props.submit} userDocId={props.userDocId}/> }
          { props.type == "join" && <JoinContent roomDocId={props.roomDocId}/> }
          { props.type == "channel" && <CreateChannelContent submit={props.submit} /> }
          { props.type == "editChannel" && <EditChannelContent submit={props.submit} channel={props.channel} /> }
          { props.type == "editRoom" && <EditRoomContent submit={props.submit} room={props.room} /> }
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

const EmailPasswordContent = (props) => {
  const [email, updateEmail] = useState('')
  const [password, updatePassword] = useState('')

  const submitForm = () => { props.submit(email, password) }

  const handleKeyPress = (e) => {
    if (e.keyCode == 13) {
      submit(e)
      document.activeElement.value = ""
    }
  }

  return (
    <Dialog.Content className={styles.DialogContent} id={styles.login}>
      <input 
        type="text" 
        placeholder="Email Address"
        onChange={(e) => {
          handleKeyPress(e)
          updateEmail(e.target.value)
        }}
        maxLength={250} 
      />
      <input 
        type="password" 
        placeholder="Password"
        onChange={(e) => {
          handleKeyPress(e)
          updatePassword(e.target.value)
        }}
        maxLength={250} 
      />
      <Dialog.Close asChild>
        <button className="save" onClick={submitForm}>Submit</button>
      </Dialog.Close>
      <Dialog.Close asChild>
        <button className="icon">
          <Cross2Icon height={20} width={20} />
        </button>
      </Dialog.Close>
    </Dialog.Content>
  )
}

const PasswordResetContent = (props) => {
  const [email, updateEmail] = useState('')

  const submit = () => { props.submit(email) }

  const handleKeyPress = (e) => {
    if (e.keyCode == 13) {
      submit(e)
      document.activeElement.value = ""
    }
  }

  return (
    <Dialog.Content className={styles.DialogContent} id={styles.reset}>
      <input 
        type="text" 
        placeholder="Email Address"
        onChange={(e) => {
          handleKeyPress(e)
          updateEmail(e.target.value)
        }}
        maxLength={250} 
      />
      <Dialog.Close asChild>
        <button className="save" onClick={submit}>Send Request</button>
      </Dialog.Close>
      <Dialog.Close asChild>
        <button className="icon">
          <Cross2Icon height={20} width={20} />
        </button>
      </Dialog.Close>
    </Dialog.Content>
  )
}

const PhotoContent = (props) => {
  const [file, updateFile] = useState()
  const [name, setName] = useState()

  const submitForm = () => { props.submit(file, name) }

  return (
    <Dialog.Content className={styles.DialogContent} id={styles.photo}>
      <div className={styles.grid}>
        <div className={styles.gridItem} position="one">
          <input 
            type="text" 
            placeholder="Name"
            onChange={(e) => {
              setName(e.target.value)
            }}
            maxLength={250} 
          />
        </div>
        <div className={styles.gridItem} position="two">
          <ImageCropper updateFile={updateFile}/>
        </div>
      </div>
      <Dialog.Close asChild>
        <button className="save" onClick={submitForm}>Submit</button>
      </Dialog.Close>
      <Dialog.Close asChild>
        <button className="icon">
          <Cross2Icon height={20} width={20} />
        </button>
      </Dialog.Close>
    </Dialog.Content>
  )
}

const CropperContent = (props) => {
  const [file, updateFile] = useState()
  const closeRef = useRef(null)

  const handleUpload = () => {
    console.log(props.userDocId)
    console.log(file)
    const storageRef = ref(storage, `/files/users/profileIcons/${file.name}`)
    const uploadTask = uploadBytesResumable(storageRef, file)
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        console.log((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
      },
      (error) => { console.log(error) },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async(url) => {
          let newImg = new Image()
          newImg.src = url
          newImg.onload = async() => {
            await updateDoc(doc(db, 'users', `${props.userDocId}`), {
              photoUrl: url
            })
            props.submit(url)
            closeRef.current.click()
          }
        })
      }
    )
  }

  return (
    <Dialog.Content className={styles.DialogContent} id={styles.cropper}>
      <ImageCropper updateFile={updateFile}/>
      <button className="save" onClick={handleUpload}>Submit</button>
      <Dialog.Close asChild>
        <button className="icon" ref={closeRef}>
          <Cross2Icon height={20} width={20} />
        </button>
      </Dialog.Close>
    </Dialog.Content>
  )
}

const SettingsContent = (props) => {
  const [userData, setUserData] = useState({})
  const [newImg, setNewImg] = useState()
  const [newName, setNewName] = useState()

  useEffect(() => {
    setUserData(JSON.parse(window.sessionStorage.getItem('userData')))
  }, [])

  return (
    <Dialog.Content className={styles.DialogContent} id={styles.settings}>
      <div className={styles.flexColumn}>
        <div className={styles.settingsNameContainer}>
          <img
            className="settingsIcon"
            src={!newImg ? userData.photoUrl : newImg}
          />
          <span className="larger">{userData.name}</span>
          <DialogContainer type="cropper" submit={setNewImg} userDocId={userData.docId}>
            <button>Change Avatar</button>
          </DialogContainer>
        </div>
        <div className={styles.settingsNameContainer}>
          <div className={styles.flexColumn}>
            <span className="medium">Username</span>
            <span className="large">{userData.name}</span>
          </div>
          <button>Edit</button>
        </div>
        <div className={styles.settingsNameContainer}>
          <div className={styles.flexColumn}>
            <span className="medium">Email</span>
            <span className="large">{userData.email}</span>
          </div>
          <button>Edit</button>
        </div>
      </div>
      <Dialog.Close asChild>
        <button className="icon">
          <Cross2Icon height={20} width={20} />
        </button>
      </Dialog.Close>
    </Dialog.Content>
  )
}

const JoinContent = (props) => {
  const [roomData, setRoomData] = useState()
  const router = useRouter()

  useEffect(() => {
    const getRoomData = async() => {
      const roomSnap = await getDoc(doc(db, 'room', props.roomDocId))
      if (!roomSnap.exists()) return
      setRoomData(roomSnap.data())
    }

    getRoomData()
  }, [roomDocId])

  const joinRoom = () => { console.log('joined') }
  const cancelJoin = () => { router.push(`./${window.localStorage.getItem('lastOpenedRoom')}`) }

  return(
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
  )

}

const CreateChannelContent = (props) => {
  const [name, updateName] = useState('')

  const submit = () => { props.submit(name) }

  const handleKeyPress = (e) => {
    if (e.keyCode == 13) {
      submit(e)
      document.activeElement.value = ""
    }
  }

  return (
    <Dialog.Content className={styles.DialogContent} id={styles.reset}>
      <input 
        type="text" 
        placeholder="Name"
        onChange={(e) => {
          handleKeyPress(e)
          updateName(e.target.value)
        }}
        maxLength={250} 
      />
      <Dialog.Close asChild>
        <button className="save" onClick={submit}>Create Channel</button>
      </Dialog.Close>
      <Dialog.Close asChild>
        <button className="icon">
          <Cross2Icon height={20} width={20} />
        </button>
      </Dialog.Close>
    </Dialog.Content>
  )
}

const EditChannelContent = (props) => {
  const [name, updateName] = useState('')

  const submit = () => { props.submit(name) }

  const handleKeyPress = (e) => {
    if (e.keyCode == 13) {
      submit(e)
      document.activeElement.value = ""
    }
  }

  return (
    <Dialog.Content className={styles.DialogContent} id={styles.reset}>
      <input 
        type="text" 
        defaultValue={props.channel.name}
        onChange={(e) => {
          handleKeyPress(e)
          updateName(e.target.value)
        }}
        maxLength={250} 
      />
      <Dialog.Close asChild>
        <button className="save" onClick={submit}>Rename Channel</button>
      </Dialog.Close>
      <Dialog.Close asChild>
        <button className="icon">
          <Cross2Icon height={20} width={20} />
        </button>
      </Dialog.Close>
    </Dialog.Content>
  )
}

const EditRoomContent = (props) => {
  const [file, updateFile] = useState()
  const [name, setName] = useState()

  const submitForm = () => { props.submit(file, name) }

  return (
    <Dialog.Content className={styles.DialogContent} id={styles.photo}>
      <div className={styles.grid}>
        <div className={styles.gridItem} position="one">
          <input 
            type="text" 
            placeholder="Name"
            onChange={(e) => {
              setName(e.target.value)
            }}
            maxLength={250} 
          />
        </div>
        <div className={styles.gridItem} position="two">
          <ImageCropper currentSrc={props.room.roomIcon} updateFile={updateFile}/>
        </div>
      </div>
      <Dialog.Close asChild>
        <button className="save" onClick={submitForm}>Submit</button>
      </Dialog.Close>
      <Dialog.Close asChild>
        <button className="icon">
          <Cross2Icon height={20} width={20} />
        </button>
      </Dialog.Close>
    </Dialog.Content>
  )
}

export default DialogContainer