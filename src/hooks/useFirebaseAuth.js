import { firebase_auth, firebase_db } from '@firebase/config'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'

const useFirebaseAuth = () => {
  const [user, setUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)

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

  const refreshUserProfile = async () => {
    if (user) {
      // get user's profile
      const docRef = doc(firebase_db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserProfile(docSnap.data())
      }
    }
  }

  useEffect(() => {
    onAuthStateChanged(firebase_auth, authStateChanged)
  }, [])

  return {user, userProfile, refreshUserProfile}
}

export default useFirebaseAuth