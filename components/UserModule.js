import { useEffect, useState } from "react"
import { GearIcon } from "@radix-ui/react-icons"
import DialogContainer from "./Dialog"

export const UserModule = () => {
  const [userData, setData] = useState({})

  useEffect(() => {
    setData(JSON.parse(window.sessionStorage.getItem('userData')))
  }, [])

  return(
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 10,
    }}>
      <img
        className="userIcon"
        src={userData.photoUrl} 
        height={50} 
        width={50}
        alt=""
      />
      <span>{userData.name}</span>
      <DialogContainer type="settings">
        <button className="transparent">
          <GearIcon width={20} height={20} />
        </button>
      </DialogContainer>
    </div>
  )
}

export default UserModule