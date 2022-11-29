import { useEffect, useRef } from "react";
import { query, getDocs, collection, where, addDoc } from "firebase/firestore";
import { db, storage } from '../utils/Firebase'
import { useRouter } from "next/router";
import { getGlobalAuth, signInWithGoogle, logInWithEmailAndPassword, sendPasswordReset, registerWithEmailandPassword } from "../utils/AuthManager";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { UserSnapshotListener } from "../utils/UserSnapshotListener";

import DialogContainer from "../components/Dialog";

export default function Login() {
  
  const router = useRouter()
  const createUserRef = useRef(null)

  useEffect(() => {
    const checkAuth = () => {
      const authGlobal = getGlobalAuth()
      if (authGlobal.currentUser != null) {
        router.push('/home')
      }
    }

    checkAuth()
  }, [router])

  const googleSignIn = async() => {
    try {
      const user = await signInWithGoogle()
      const queryRef = query(collection(db, 'users'), where('uid', '==', user.uid))
      const querySnapshot = await getDocs(queryRef)

      if (querySnapshot.docs.length == 0) {
        await addDoc(collection(db, 'users'), {
          blockedUsers: [],
          uid: user.uid,
          name: user.displayName,
          authProvider: 'google',
          email: user.email,
          photoUrl: user.photoURL,
          rooms: [],
        })
      }

      router.push(`./${'wdmTyHNou54R1b2mgZjK'}`)
    } catch (error) {
      console.log(error)
    }
  }

  const emailAndPasswordSignIn = async(email, password) => {
    try {
      const user = await logInWithEmailAndPassword(email, password)
      const queryRef = query(collection(db, 'users'), where('uid', '==', user.uid))
      const userDocs = await getDocs(queryRef)
        
      const listener = UserSnapshotListener(userDocs.docs[0].id)
      listener()
      console.log(JSON.parse(window.sessionStorage.getItem('userData')))

      router.push(`./${'wdmTyHNou54R1b2mgZjK'}`)
    } catch(error) {
      console.log(error)
    }
  }

  const registerRoute = async(email, password) => {
    if (email && password != null) {
      await registerWithEmailandPassword(email, password)
      createUserRef.current.click()
    } else {
      alert('Please fill out the required fields')
    }
  }

  const createUser = async (profileIcon, username) => {
    try {
      const storageRef = ref(storage, `/files/users/profileIcons/${profileIcon.name}`)
      const uploadTask = uploadBytesResumable(storageRef, profileIcon)
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          console.log(Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          ))
        },
        (error) => console.log(error),
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async(url) => {
            const authGlobal = getGlobalAuth()
            const user = authGlobal.currentUser
            const usersRef = collection(db.users)
            await addDoc(usersRef, {
              blockedUsers: [],
              uid: user.uid,
              name: username,
              email: user.email,
              photoUrl: url,
              rooms: [],
            })
            router.push(`./${'wdmTyHNou54R1b2mgZjK'}`)
          })
        }
      )
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="card" id="login">
      <div className="actions">
        <DialogContainer type="photo" submit={createUser}>
          <button ref={createUserRef} style={{display: 'none'}}/>
        </DialogContainer>
        <DialogContainer type="emailPassword" submit={emailAndPasswordSignIn}>
          <button className="save">Login</button>
        </DialogContainer>
        <button className="save" onClick={googleSignIn}>Sign In With Google</button>
        
      </div>
      <div className="footer">
        <DialogContainer type="passwordReset" submit={sendPasswordReset}>
          <a href="#">Forgot Password?</a>
        </DialogContainer>
        <span>Don&#39;t have an account?
          <DialogContainer type="emailPassword" submit={registerRoute}>
            <a href="#">Register Now.</a>
          </DialogContainer>
        </span>
      </div>
    </div>
  );
}