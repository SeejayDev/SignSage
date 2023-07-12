import { firebase_auth, firebase_db } from '@firebase/config'
import { onAuthStateChanged, signOut, signInWithEmailAndPassword } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

const useFirebaseAuth = () => {
  const [user, setUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [authLoading, setAuthLoading] = useState(false)
  const router = useRouter()

  const authStateChanged = async (authState) => {
    if (!authState) {
      // if user is not logged in, reset the value
      setUser(null)
      return
    }

    // if the user is logged in
    setUser(authState)

    // get user's profile
    const docRef = doc(firebase_db, "users", authState.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setUserProfile(docSnap.data())
    }
  }

  const doLogin = (email, password) => {
    setAuthLoading(true)
    signInWithEmailAndPassword(firebase_auth, email, password)
    .then(()=>{
      setAuthLoading(false)
    })
  }

  const doLogout = () => {
    signOut(firebase_auth)
    router.push("/")
  }

  useEffect(() => {
    onAuthStateChanged(firebase_auth, authStateChanged)
  }, [])

  return {user, doLogout, authLoading, doLogin, userProfile}
}

export default useFirebaseAuth