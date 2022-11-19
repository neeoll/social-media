import * as Menu from '@radix-ui/react-context-menu';
import { arrayUnion, collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { db } from '../utils/Firebase';
import styles from '../styles/Components.module.css'

export const RoomContextMenu = (props) => {

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
          <Menu.Item className={styles.ContextMenuItem} onSelect={handleDelete}>
            Delete
          </Menu.Item>
        </Menu.Content>
      </Menu.Portal>
    </Menu.Root>
  );
};

export default RoomContextMenu;

