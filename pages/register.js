import Header from "@components/Header";
import { firebase_auth, firebase_db } from "@firebase/config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore"; 
import { useRouter } from "next/router";
import React, { useState } from 'react'
import { CheckmarkBox } from "src/icons/CheckmarkBox";
import Loading from "src/icons/Loading";
import RegularContainer from "src/layouts/RegularContainer";

const register = () => {
  const [error, setError] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const router = useRouter()

  const submitForm = async (e) => {
    e.preventDefault()
    setIsCreating(true)

    // get data from form object
    const formData = new FormData(e.target)
    const payload = Object.fromEntries(formData)

    const { email, password, username } = payload

    if (username === "") {setError("Username is required!"); setIsCreating(false); return;}
    if (email === "") {setError("Email is required!"); setIsCreating(false); return;}

    if (password.length < 6) {
      setError("Password must be at least 6 characters!")
      return
    }
    if (password !== payload["confirm-password"]) {
      setError("Passwords do not match!")
      return
    }

    // Create the new account
    createUserWithEmailAndPassword(firebase_auth, email, password)
    .then((credentials) => {
      //console.log(credentials)
      const newUser = {
        'role': 'student',
        'username': username
      }

      setDoc(doc(firebase_db, "users", credentials.user.uid), newUser)
      .catch((error)=> {
        console.log(error)
      })
    }).catch((error) => {
      let errorCode = error.code
      switch(errorCode) {
        case "auth/email-already-in-use":
          setError("This email has already been registered with an account. Login or use a different email.");
          break;
        default:
          setError("Something went wrong.")
      }
    })

    setIsCreating(false)
    router.push("/dashboard")
  }

  return (
    <>
      <Header />

      <RegularContainer>
        <p className="mt-8 font-bold text-4xl text-primary">Create a SignSage account</p>

        <div className='flex justify-center mt-8 space-x-4'>
          <div className='w-3/5'>
            <p className="text-2xl font-medium">You are one step closer to learning sign language!</p>

            <div className="flex flex-col mt-8 space-y-2">
              <p className="text-lg">Having an account lets you:</p>
              <div className="flex items-center">
                <CheckmarkBox className="text-primary w-6 h-6 mr-2" />
                <p>Track your learning progress</p>
              </div>
              <div className="flex items-center">
                <CheckmarkBox className="text-primary w-6 h-6 mr-2" />
                <p>Bookmark courses to focus on</p>
              </div>
              <div className="flex items-center">
                <CheckmarkBox className="text-primary w-6 h-6 mr-2" />
                <p>Save lessons to complete later</p>
              </div>
            </div>

            <p className="mt-8 italic text-sm">All your personal information is stored securely on our servers and will not be shared with third parties without your prior consent.</p>
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