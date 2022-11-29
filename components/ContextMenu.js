import * as Menu from '@radix-ui/react-context-menu';
import { arrayUnion, collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { db } from '../utils/Firebase';
import styles from '../styles/Components.module.css'

export const ContextMenuContainer = (props) => {
  return (
    <Menu.Root>
      <Menu.Trigger asChild>
        {props.children}
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Content className={styles.ContextMenuContent} sideOffset={5} align="end">
          { props.type == "channel" && <ChannelContent edit={props.edit} delete={props.delete} /> }
          { props.type == "message" && <MessageContent delete={props.delete} /> }
          { props.type == "room" && <RoomContent edit={props.edit} delete={props.delete} /> }
          { props.type == "user" && <UserContent senderUid={props.senderUid} /> }
        </Menu.Content>
      </Menu.Portal>
    </Menu.Root>
  )
}

const ChannelContent = (props) => {
  return (
    <>
      {/* <Menu.Item className={styles.ContextMenuItem} onSelect={props.edit}>
        Rename
      </Menu.Item> */}
      <Menu.Item className={styles.ContextMenuItem} id={styles.remove} onSelect={props.delete}>
        Delete
      </Menu.Item>
    </>
  )
}

const MessageContent = (props) => {
  return (
    <>
      <Menu.Item className={styles.ContextMenuItem} onSelect={props.delete}>
        Delete
      </Menu.Item>
    </>
  )
}

const RoomContent = (props) => {
  return (
    <>
      <Menu.Item className={styles.ContextMenuItem} onSelect={props.edit}>
        Edit Room
      </Menu.Item>
      <Menu.Item className={styles.ContextMenuItem} onSelect={props.delete}>
        Leave Room
      </Menu.Item>
    </>
  )
}

const UserContent = (props) => {
  const handleBlock = async() => {
    const userData = JSON.parse(window.sessionStorage.getItem('userData'))
    const userQuery = query(collection(db, 'users'), where('uid', '==', userData.uid))
    const userSnap = await getDocs(userQuery)
    userSnap.forEach(async(snapshot) => {
      const userRef = doc(db, 'users', snapshot.id)
      await updateDoc(userRef, {
        blockedUsers: arrayUnion(props.senderUid)
      })
    })
  }
  
  return (
    <>
      <Menu.Item className={styles.ContextMenuItem} onSelect={handleBlock}>
        Block
      </Menu.Item>
    </>
  );
}

export default ContextMenuContainer

