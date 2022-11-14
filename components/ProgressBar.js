import { styled } from "@stitches/react"
import { Cross2Icon } from "@radix-ui/react-icons"
import styles from '../styles/Components.module.css'

export const ProgressBar = ({ cancelUpload, filename, progress }) => {
      
  const Fill = styled('div', {
    height: 10,
    width: `${progress}%`,
    backgroundColor: '#90F3FF',
    borderRadius: 5,
  })    

  return (
    <div className={styles.ProgressBarParent}>
      <div className={styles.ProgressBarMain}>
        <span>{filename}</span>
        <div className={styles.ProgressBar}>
          <Fill />
        </div>
      </div>
      <button className="icon" onClick={cancelUpload}>
        <Cross2Icon height={20} width={20} />
      </button>
    </div>
  )
}

export default ProgressBar