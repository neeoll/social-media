import { memo, useEffect, useState } from "react"
import ProgressiveImg from "./ProgressiveImg"
import placeholder from '../images/placeholder.png'
import { useRouter } from "next/router";
import Invite from "./Invite"
import isURL from "validator/lib/isURL"
import styles from '../styles/Components.module.css'
import { ContextMenuContainer } from "./ContextMenu";

const Message = ({ key, data, uid }) => {
  const [timeSent, setTime] = useState('')
  const [isUrl, updateUrlStatus] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkIfURL = async() => {
      // PRODUCTION: if (isUrl(data.contents)) updateUrlStatus(true)
      try {
        let url = new URL(data.contents)
        updateUrlStatus(true)
      } catch(error) {
        updateUrlStatus(false)
      }
    }

    const getTimestamp = () => {
      const messageDate = new Date(data.createdAt * 1000)
      const currentTime = Date.now()
      const currentDate = new Date(currentTime)
      
      switch (currentDate.getUTCDate() - messageDate.getUTCDate()) {
        case 0: {
          let time = ""
          let localeTimeStrings = messageDate.toLocaleTimeString().split(" ")
          let timeStrings = localeTimeStrings[0].split(":")
          time = `Today at ${timeStrings[0]}:${timeStrings[1]} ${localeTimeStrings[1]}`
          setTime(time)
          return
        }
        case 1: {
          let time = ""
          let localeTimeStrings = messageDate.toLocaleTimeString().split(" ")
          let timeStrings = localeTimeStrings[0].split(":")
          time = `Yesterday at ${timeStrings[0]}:${timeStrings[1]} ${localeTimeStrings[1]}`
          setTime(time)
          return
        }
        default: {
          setTime(messageDate.toLocaleDateString())
          return
        }
      }
    }

    checkIfURL()
    getTimestamp()
  }, [data])

  const handleClick = () => {
    console.log(data.contents)
    const docId = data.contents.split('/')[3]
    router.push(`./${docId}`)
  }

  return (
    <div className={styles.MessageContainer}>
      <div>
        <img
          className="userIcon"
          src={data.senderProfileIcon} 
          alt=""
        />
      </div>
      <div className={styles.TextContainer}>
        <ContextMenuContainer type="user" senderUid={data.senderUid}>
          <div className="messageHeader">
            <span className="large">{data.senderName}</span>
            <span className="small">{timeSent}</span>
          </div>
        </ContextMenuContainer>
        {isUrl == true ? 
          <a href={data.contents}>{data.contents}</a> :
          <span>{data.contents}</span> 
        }
        {data.isInvite == true && <Invite url={data.contents}/>}
        {data.attachment != '' &&
          <ProgressiveImg 
            placeholderSrc={placeholder.src}
            attachment={data.attachment} />
        }
      </div>
    </div>
  )
}

export default memo(Message)
