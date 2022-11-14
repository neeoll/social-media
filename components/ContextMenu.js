import React from 'react';
import * as Menu from '@radix-ui/react-context-menu';
import { arrayUnion, collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { db } from '../utils/Firebase';
import { getGlobalAuth } from '../utils/AuthManager';
import styles from '../styles/Components.module.css'

export const ContextMenu = ({senderUid, children}) => {

  const handleBlock = async() => {
    const globalAuth = getGlobalAuth()
    const userQuery = query(collection(db, 'users'), where('uid', '==', globalAuth.currentUser.uid))
    const userSnap = await getDocs(userQuery)
    userSnap.forEach(async(snapshot) => {
      const userRef = doc(db, 'users', snapshot.id)
      await updateDoc(userRef, {
        blockedUsers: arrayUnion(senderUid)
      })
    })
  }

  return (
    <Menu.Root>
      <Menu.Trigger>
        {children}
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Content className={styles.ContextMenuContent} sideOffset={5} align="end">
          <Menu.Item className={styles.ContextMenuItem} onSelect={handleBlock}>
            Block
          </Menu.Item>
        </Menu.Content>
      </Menu.Portal>
    </Menu.Root>
  );
};

export default ContextMenu;

