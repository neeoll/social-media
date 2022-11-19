import * as Dialog from "@radix-ui/react-dialog"
import { Cross2Icon } from "@radix-ui/react-icons"
import { useState } from "react"
import styles from '../styles/Components.module.css'

const PasswordResetDialog = ({ confirm, children }) => {

  const [textData, updateText] = useState('')

  const handleKeyPress = (e) => {
    if (e.keyCode == 13) {
      submit(e)
      document.activeElement.value = ""
    }
  }

  const submit = () => { 
    confirm(textData)
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        {children}
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.DialogOverlay}>
          <Dialog.Content className={styles.DialogContent} id={styles.reset}>
          <input 
              type="text" 
              placeholder="Email Address"
              onChange={(e) => {
                handleKeyPress(e)
                updateText(e.target.value)
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
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export default PasswordResetDialog
