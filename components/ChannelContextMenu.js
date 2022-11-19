import * as Menu from '@radix-ui/react-context-menu';
import styles from '../styles/Components.module.css'

export const ChannelContextMenu = (props) => {

  const handleDelete = async() => {
    props.delete()
  }

  return (
    <Menu.Root>
      <Menu.Trigger className={styles.ContextMenuTrigger}>
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

export default ChannelContextMenu;

