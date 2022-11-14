import { memo, useEffect, useState } from "react"
import ProgressiveImg from "./ProgressiveImg"
import placeholder from '../images/placeholder.png'
import ContextMenu from "./ContextMenu"
import { useRouter } from "next/router";
import Invite from "./Invite"
import Image from "next/image"
import isURL from "validator/lib/isURL"
import styles from '../styles/Components.module.css'

const Message = ({ data }) => {

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
      var date = new Date(data.created * 1000)
      var hh = date.getUTCHours()
      var mm = date.getUTCMinutes()
      
      if (hh > 12) {hh = hh % 12}
      if (mm < 10) {mm = "0"+mm}
      
      setTime(hh+":"+mm)
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
        <Image
          className="userIcon"
          src={data.senderProfileIcon} 
          alt=""
          width={50}
          height={50}
        />
      </div>
      <div className={styles.TextContainer}>
        <ContextMenu senderUid={data.senderUid}><span>{data.senderName} {timeSent}</span></ContextMenu>
        {isUrl == true ? 
          <a href={data.contents}>{data.contents}</a> :
          <span>{data.contents}</span> 
        }
        {data.isInvite == true && <Invite url={data.contents}/>}
        {data.attachments != '' &&
          <ProgressiveImg 
            placeholderSrc={placeholder.src}
            src={data.attachments} />
        }
      </div>
    </div>
  )
}

export default memo(Message)
