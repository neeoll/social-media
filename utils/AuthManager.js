import {initializeApp} from "firebase/app";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  createUserWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import {firebaseConfig} from "../firebaseConfig";

const app = initializeApp(firebaseConfig);
const globalAuth = getAuth(app);

export const getGlobalAuth = () => {
  return globalAuth
}

export const signInWithGoogle = async () => {
  try {
    await setPersistence(globalAuth, browserLocalPersistence).then(async () => {
      const googleProvider = new GoogleAuthProvider();
      return signInWithPopup(globalAuth, googleProvider);
    });

    return globalAuth.currentUser;
  } catch (error) {
    console.log(error);
  }
};

export const logInWithEmailAndPassword = async (email, password) => {
  try {
    await setPersistence(globalAuth, browserLocalPersistence).then(async () => {
      return signInWithEmailAndPassword(globalAuth, email, password);
    });

    return globalAuth.currentUser;
  } catch (err) {
    console.error(err);
  }
};

export const registerWithEmailandPassword = async (email, password) => {
  try {
    const credentials = await createUserWithEmailAndPassword(globalAuth, email, password)
    return credentials.user
  } catch (error) {
    console.log(error);
  }
};

export const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(globalAuth, email);
  } catch (error) {
    console.log(error);
  }
};

export const logout = () => {
  signOut(globalAuth);
};
