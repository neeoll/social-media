import * as Dialog from "@radix-ui/react-dialog"
import { Cross2Icon } from "@radix-ui/react-icons"
import styles from '../styles/Components.module.css'

const EmailAndPasswordDialog = ({ submit, updateEmail, updatePassword, children }) => {

  const submitForm = () => {
    submit()
  }

  const handleKeyPress = (e) => {
    if (e.keyCode == 13) {
      submit(e)
      document.activeElement.value = ""
    }
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        {children}
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.DialogOverlay}>
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
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export default EmailAndPasswordDialog;
