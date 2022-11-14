import { useEffect, useState } from "react"

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
    </div>
  )
}

export default UserModule