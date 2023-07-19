// Programmer Name  : Mr.Yeoh Cheng Jin, APU, BSc (Hons) in Computer Science (Intelligent Systems)
// Program Name     : dashboard/register.js
// Description      : To register a new teacher account.
// First Written on : 14 June 2023
// Edited on        : 19 July 2023

import Header from "@components/Header";
import { firebase_auth, firebase_db } from "@firebase/config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore"; 
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from 'react'
import { CheckmarkBox } from "src/icons/CheckmarkBox";
import Loading from "src/icons/Loading";
import { RightArrow } from "src/icons/RightArrow";
import RegularContainer from "src/layouts/RegularContainer";

const register = () => {
  const [error, setError] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const router = useRouter()

  const submitForm = async (e) => {
    e.preventDefault()
    setError("")
    setIsCreating(true)

    // get data from form object
    const formData = new FormData(e.target)
    const payload = Object.fromEntries(formData)

    const { email, password, username } = payload

    if (username === "") {setError("Username is required!"); setIsCreating(false); return;}
    if (email === "") {setError("Email is required!"); setIsCreating(false); return;}

    if (password.length < 6) {
      setError("Password must be at least 6 characters!")
      setIsCreating(false)
      return
    }
    if (password !== payload["confirm-password"]) {
      setError("Passwords do not match!")
      setIsCreating(false)
      return
    }

    // Create the new account
    createUserWithEmailAndPassword(firebase_auth, email, password)
    .then((credentials) => {
      //console.log(credentials)
      const newUser = {
        'role': 'teacher',
        'username': username
      }

      setDoc(doc(firebase_db, "users", credentials.user.uid), newUser).then(() => {
        router.push("/dashboard")
        setIsCreating(false)
      })
      .catch((error)=> {
        console.log(error)
      })
    }).catch((error) => {
      let errorCode = error.code
      switch(errorCode) {
        case "auth/email-already-in-use":
          setError("This email has already been registered with an account. Use a different email.");
          setIsCreating(false)
          break;
        default:
          setError("Something went wrong.")
          setIsCreating(false)
      }
    })
  }

  return (
    <>
      <Header />

      <RegularContainer>
        <div className='flex justify-center mt-8 space-x-4'>
          <div className='w-3/5'>
            <Link href="/dashboard">
              <div className='flex items-center text-sm text-primary hover:underline font-medium'>
                <RightArrow className="transform rotate-180 h-5 w-5" />
                <p>Back to Dashboard</p>
              </div>
            </Link>
            
            <p className="font-bold text-3xl text-primary mt-2">Register new teacher account</p>

            <div className="flex flex-col mt-4 space-y-2 text-sm">
              <p className="">Keep in mind that all teachers can:</p>
              <div className="flex items-center">
                <CheckmarkBox className="text-primary w-6 h-6 mr-2" />
                <p>View all SignSage content</p>
              </div>
              <div className="flex items-center">
                <CheckmarkBox className="text-primary w-6 h-6 mr-2" />
                <p>Edit any course or lesson</p>
              </div>
              <div className="flex items-center">
                <CheckmarkBox className="text-primary w-6 h-6 mr-2" />
                <p>Create new courses and lessons</p>
              </div>
            </div>

            <p className="font-bold text-red-600 mt-6">WARNING: CREATING A NEW ACCOUNT WILL SIGN THE CURRENT ACCOUNT OUT.</p>
            <p className="font-bold text-red-600">LOGOUT AND LOGIN AGAIN TO RETURN TO THE CURRENT ACCOUNT.</p>
          </div>

          <div className='w-2/5'>
            <form onSubmit={submitForm}>
              <div className="flex flex-col space-y-4">
                <input type="text" className="border-2 rounded-md p-2" placeholder="Username" name="username" />

                <input type="email" className="border-2 rounded-md p-2" placeholder="Email" name="email" />

                <input type="password" className="border-2 rounded-md p-2" placeholder="Password" name="password" />

                <input type="password" className="border-2 rounded-md p-2" placeholder="Confirm Password" name="confirm-password"/>

                <button type="submit" className="bg-primary text-white rounded-md py-2 font-bold">
                  {isCreating ? <Loading className="w-6 h-6 animate-spin" /> : <p>Submit</p>}
                </button>

                <p className="font-medium text-red-600">{error}</p>
              </div>
            </form>
          </div>
        </div>
      </RegularContainer>
    </>
  )
}

export default register