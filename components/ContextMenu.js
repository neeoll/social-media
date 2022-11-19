import * as Menu from '@radix-ui/react-context-menu';
import { arrayUnion, collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { db } from '../utils/Firebase';
import styles from '../styles/Components.module.css'

export const ContextMenu = (props) => {

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

  const handleDelete = async() => {
    props.delete()
  }

  return (
    <Menu.Root>
      <Menu.Trigger>
        {props.children}
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Content className={styles.ContextMenuContent} sideOffset={5} align="end">
          {props.type == 'user' &&
            <Menu.Item className={styles.ContextMenuItem} onSelect={handleBlock}>
              Block
            </Menu.Item>
          }
          {props.type == 'channel' &&
            <Menu.Item className={styles.ContextMenuItem} onSelect={handleDelete}>
              Delete
            </Menu.Item>
          }
        </Menu.Content>
      </Menu.Portal>
    </Menu.Root>
  );
};

export default ContextMenu;

