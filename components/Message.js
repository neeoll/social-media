import { memo, useEffect, useState } from "react"
import ProgressiveImg from "./ProgressiveImg"
import placeholder from '../images/placeholder.png'
import UserContextMenu from "./UserContextMenu"
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
      var date = new Date(data.createdAt * 1000)
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
        <UserContextMenu senderUid={data.senderUid}><span>{data.senderName} {timeSent}</span></UserContextMenu>
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
