import { firebase_auth } from '@firebase/config'
import { onAuthStateChanged, signOut, signInWithEmailAndPassword } from 'firebase/auth'
import React, { useEffect, useState } from 'react'

const useFirebaseAuth = () => {
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(false)

  const authStateChanged = async (authState) => {
    if (!authState) {
      // if user is not logged in, reset the value
      setUser(null)
      return
    }

    // if the user is logged in
    setUser(authState)
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
  }

  useEffect(() => {
    onAuthStateChanged(firebase_auth, authStateChanged)
  }, [])

  return {user, doLogout, authLoading, doLogin}
}

export default useFirebaseAuth