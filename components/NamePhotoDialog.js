import * as Dialog from "@radix-ui/react-dialog"
import { Cross2Icon } from "@radix-ui/react-icons"
import { useState } from "react"
import ImageCropper from "./ImageCropper"
import styles from '../styles/Components.module.css'

const NamePhotoDialog = ({ submit, children, placeholder }) => {

  const [file, updateFile] = useState()
  const [name, setName] = useState()

  const submitForm = () => {
    submit(file, name)
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        {children}
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.DialogOverlay}>
          <Dialog.Content className={styles.DialogContent} id={styles.photo}>
            <div className={styles.grid}>
              <div className={styles.gridItem} position="one">
                <input 
                  type="text" 
                  placeholder={placeholder}
                  onChange={(e) => {
                    handleKeyPress(e)
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
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export default NamePhotoDialog
