// Programmer Name  : Mr.Yeoh Cheng Jin, APU, BSc (Hons) in Computer Science (Intelligent Systems)
// Program Name     : dashboard/profile.js
// Description      : To view the user's profile.
// First Written on : 14 June 2023
// Edited on        : 19 July 2023

import Header from '@components/Header'
import { firebase_db } from '@firebase/config'
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth'
import { doc, updateDoc } from 'firebase/firestore'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import useFirebaseAuth from 'src/hooks/useFirebaseAuth'
import Loading from 'src/icons/Loading'
import { RightArrow } from 'src/icons/RightArrow'
import RegularContainer from 'src/layouts/RegularContainer'

const profile = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [tabIndex, setTabIndex] = useState(0)
  
  const router = useRouter()
  const {user, userProfile} = useFirebaseAuth()

  const updateProfileUsername = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.target)
    const payload = Object.fromEntries(formData)
    const { username } = payload
    if (username === "") {setErrorMessage("Username is required!"); setIsLoading(false); return;}

    updateDoc(doc(firebase_db, "users", user.uid), {username: username}).then(() => {
      router.push("/dashboard")
    })
  }

  const updateProfilePassword = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.target)
    const payload = Object.fromEntries(formData)
    const { previousPassword, newPassword, confirmPassword } = payload

    if (previousPassword === "") {setErrorMessage("Enter your old password!"); setIsLoading(false); return;}
    if (newPassword === "") {setErrorMessage("Enter a new password!"); setIsLoading(false); return;}
    if (newPassword.length < 6) {setErrorMessage("New password must be at least 6 characters!"); setIsLoading(false); return}
    if (newPassword !== confirmPassword) {setErrorMessage("Passwords do not match!"); setIsLoading(false); return;}
    if (newPassword === previousPassword) {setErrorMessage("New password is the same!"); setIsLoading(false); return;}

    const credentials = EmailAuthProvider.credential(user.email, previousPassword)
    reauthenticateWithCredential(user, credentials).then(() => {
      // previous password checks out
      updatePassword(user, newPassword).then(() => {
        alert("Password updated successfully!")
        router.push("/dashboard")
      })
    }).catch((error) => {
      if (error.code === "auth/wrong-password") {
        setErrorMessage("Old password is incorrect.");
      }
    })

    setIsLoading(false)
  }

  useEffect(() => {
    setErrorMessage("")
  }, [tabIndex])

  return (
    <>
      <Header />

      <RegularContainer>
        <div className='flex mt-8'>
          <div className='w-3/5 flex flex-col pb-4'>
                        
            <Link href="/dashboard">
              <div className='flex items-center text-sm text-primary hover:underline font-medium'>
                <RightArrow className="transform rotate-180 h-5 w-5" />
                <p>Back to Dashboard</p>
              </div>
            </Link>

            <div className='flex font-bold text-4xl uppercase space-x-2 items-center mt-4'>
              <p className="bg-primary p-2 rounded-md text-white">Edit</p>
              <p className=''>profile</p>
            </div>

            <p className='mt-2 font-medium'>Update your password or username.</p>

            <div className='flex items-center gap-4 mt-8'>
              <button className='relative border-4 border-purple-600 rounded-md overflow-hidden p-4 font-bold' onClick={()=>setTabIndex(0)}>
                <div className={`bg-purple-600 absolute w-full h-full top-0 left-0 transition-all ease-in-out transform z-10 ${tabIndex !== 0 && "translate-x-full"}`}></div>
                <p className={`${tabIndex !== 0 ? "text-purple-600" : "text-white"} relative z-20`}>Update Username</p>
              </button>

              <button className='relative border-4 border-purple-600 rounded-md overflow-hidden p-4 text-purple-600 font-bold' onClick={()=>setTabIndex(1)}>
                <div className={`bg-purple-600 absolute w-full h-full top-0 left-0 transition-all ease-in-out transform ${tabIndex !== 1 && "-translate-x-full"}`}></div>
                <p className={`${tabIndex !== 1 ? "text-purple-600" : "text-white"} relative z-20`}>Update Password</p>
              </button>
            </div>
          </div>

          <div className='w-2/5 border-4 p-8 rounded-md border-primary'>
            {tabIndex === 0 &&
              <form className='h-full' onSubmit={updateProfileUsername}>
                <div className="flex flex-col h-full justify-between">
                  <p className='font-medium'>Current username: {userProfile?.username}</p>

                  <input type="text" className="border-2 rounded-md p-2 mt-2" placeholder="New Username" name="username" />
                  <div className='flex-1'></div>

                  {errorMessage !== "" && <p className='font-medium text-red-600 mb-2'>{errorMessage}</p> }

                  <button type="submit" className="bg-primary text-white rounded-md py-2 font-bold flex justify-center">
                    {isLoading ? <Loading className="w-6 h-6 animate-spin" /> : <p>Update Username</p>}
                  </button>
                </div>
              </form>
            }

            {tabIndex === 1 &&
              <form onSubmit={updateProfilePassword}>
                <div className="flex flex-col space-y-4">
                  <p className='font-medium'>Current email: {user.email}</p>

                  <input type="password" className="border-2 rounded-md p-2" placeholder="Old Password" name="previousPassword" />

                  <input type="password" className="border-2 rounded-md p-2" placeholder="New Password" name="newPassword" />

                  <input type="password" className="border-2 rounded-md p-2" placeholder="Confirm Password" name="confirmPassword" />

                  <button type="submit" className="bg-primary text-white rounded-md py-2 font-bold">
                    {isLoading ? <Loading className="w-6 h-6 animate-spin" /> : <p>Update Password</p>}
                  </button>

                  {errorMessage !== "" && <p className='font-medium text-red-600'>{errorMessage}</p> }
                </div>
              </form>
            }
          </div>
        </div>
      </RegularContainer>
    </>
  )
}

export default profile