import { gray } from "@radix-ui/colors"
import { PlusIcon } from '@radix-ui/react-icons'
import { useRef, useState } from "react"
import { Cross2Icon } from "@radix-ui/react-icons"
import styles from '../styles/Components.module.css'

const MessageInput = ({ submit, updateFile, children }) => {

  const hiddenFileInput = useRef(null)
  const [src, setSrc] = useState(null)
  const [text, updateText] = useState('')

  const handleClick = () => {
    hiddenFileInput.current.click()
  }

  const handleKeyPress = (e) => {
    if (e.keyCode == 13) {
      setSrc(null)
      submit(e, text);
      document.activeElement.value = "";
    }
  };

  const updateValue = (value) => {
    updateText(value)
  }

  const handleChange = (event) => {
    const src = URL.createObjectURL(event.target.files[0])
    setSrc(src)
    updateFile(event.target.files[0])
  }

  const removeSrc = () => {
    setSrc(null)
    updateFile(null)
  }

  return (
    <div className={styles.MessageInputParent}>
      {src != null &&
        <div>
          <img
            className="imgPreview"
            src={src}
            alt="" 
          />
          <button className="icon" onClick={removeSrc}>
            <Cross2Icon height={20} width={20} />
          </button>
        </div>
      }
      <div className={styles.MessageInputContainer}>
        <button id="addFile" className="icon" onClick={handleClick}>
          <PlusIcon width={25} height={25} color={gray.gray3}/>
        </button>
        <input type="file" accept="image/*" onChange={handleChange} ref={hiddenFileInput} style={{display: 'none'}}/>
        <input 
          type="text"
          className="message"
          onKeyDown={handleKeyPress}
          placeholder={children}
          onChange={(e) => {
            handleKeyPress(e)
            updateValue(e.target.value)
          }}
        />
      </div>
    </div>
  );
};

export default MessageInput;
