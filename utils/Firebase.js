import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyC20jtvUGR7GXFPqw738gYvysDAmk8bLUs",
  authDomain: "social-media-c6805.firebaseapp.com",
  projectId: "social-media-c6805",
  storageBucket: "social-media-c6805.appspot.com",
  messagingSenderId: "544179514464",
  appId: "1:544179514464:web:44d5009cb82a8c1d416705",
  measurementId: "G-D3M7ZPSKE5"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app)

export { db, storage }