import { useEffect, useRef, useState } from "react";
import { query, getDocs, collection, where, addDoc, Timestamp } from "firebase/firestore";
import { db, storage } from '../utils/Firebase'
import { useRouter } from "next/router";
import { getGlobalAuth, signInWithGoogle, logInWithEmailAndPassword, sendPasswordReset, registerWithEmailandPassword } from "../utils/AuthManager";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { UserSnapshotListener } from "../utils/UserSnapshotListener";

import PasswordResetDialog from '../components/PasswordResetDialog'
import NamePhotoDialog from "../components/NamePhotoDialog";
import EmailAndPasswordDialog from "../components/EmailAndPasswordDialog";

export default function Login() {

  const [email, updateEmail] = useState('')
  const [password, updatePassword] = useState('')
  const router = useRouter()
  const createUserRef = useRef(null)

  const checkAuth = () => {
    const authGlobal = getGlobalAuth()
    if (authGlobal.currentUser != null) {
      router.push('/home')
    }
  }

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

  const emailAndPasswordSignIn = async() => {
    try {
      const user = await logInWithEmailAndPassword(email, password)
      const queryRef = query(collection(db, 'users'), where('uid', '==', user.uid))
      const userDocs = await getDocs(queryRef)
        
      const listener = UserSnapshotListener(userDocs.docs[0].id)
      listener()

      router.push(`./${'wdmTyHNou54R1b2mgZjK'}`)
    } catch(error) {
      console.log(error)
    }
  }

  const registerRoute = async() => {
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

  function generateId(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
  }

  const populateDatabase = async() => {
    // Register and sign in to get auth access
    await registerWithEmailandPassword("a.vidgamer.na@gmail.com", "password")
    const user = await logInWithEmailAndPassword("a.vidgamer.na@gmail.com", "password")

    // Create message document and fill with placeholder data to reference later
    let rawPosts = await fetch('https://jsonplaceholder.typicode.com/posts').then(response => response.json())
    let newMessages = []
    rawPosts.forEach(post => {
      newMessages.push({
        attachments: '',
        contents: post.body,
        created: Timestamp.now().seconds,
        isInvite: false,
        messageId: generateId(10),
        senderName: 'Nolas',
        senderProfileIcon: '',
        senderUid: user.uid
      })
    })
    const messagesRef = await addDoc(collection(db, 'messages'), {
      messages: newMessages
    })

    // Create room and pass in 
    const roomRef = await addDoc(collection(db, 'rooms'), {
      channels: [{
        id: `${messagesRef.path}`,
        name: 'general'
      }],
      name: 'Global',
      users: [user.uid],
      roomIcon: '',
      shortName: 'G'
    })

    // Create user entry in the database now that the roomRef has been created
    await addDoc(collection(db, 'users'), {
      blockedUsers: [],
      uid: user.uid,
      name: 'Nolas',
      email: user.email,
      photoUrl: '',
      rooms: [`${roomRef.path}`],
    })
  }


  return (
    <div className="card" id="login">
      <div className="actions">
        <NamePhotoDialog submit={createUser} placeholder={"Username"}>
          <button ref={createUserRef} style={{display: 'none'}}/>
        </NamePhotoDialog>
        <EmailAndPasswordDialog submit={emailAndPasswordSignIn} updateEmail={updateEmail} updatePassword={updatePassword}>
          <button className="save">Login</button>
        </EmailAndPasswordDialog>
        <button className="save" onClick={googleSignIn}>Sign In With Google</button>
        <button className="save" onClick={populateDatabase}>Populate Database</button>
      </div>
      <div className="footer">
        <PasswordResetDialog confirm={() => {sendPasswordReset(email)}} update={updateEmail}>
          <a href="#">Forgot Password?</a>
        </PasswordResetDialog>
        <span>Don&#39;t have an account?
          <EmailAndPasswordDialog submit={registerRoute} updateEmail={updateEmail} updatePassword={updatePassword}>
            <a href="#">Register Now.</a>
          </EmailAndPasswordDialog>
        </span>
      </div>
    </div>
  );
}