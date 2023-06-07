import { firebase_auth } from "@firebase/config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState } from 'react'

const index = () => {
  const [error, setError] = useState('')

  const submitForm = async (e) => {
    e.preventDefault()

    // get data from form object
    const formData = new FormData(e.target)
    const payload = Object.fromEntries(formData)

    const { email, password } = payload
    if (password.length < 6) {
      setError("Password must be at least 6 characters!")
      return
    }
    if (password !== payload["confirm-password"]) {
      setError("Passwords do not match!")
      return
    }

    // Create the new account
    createUserWithEmailAndPassword(firebase_auth, payload.email, payload.password)
    .then((credentials) => {
      console.log(credentials)
    })
    .catch((error) => {
      console.log(error.message)
    })
  }

  return (
    <div className='flex items-center justify-center p-16'>
      <div className='flex '>
        <div className='w-1/2'>
          <p>Create a SignSage account</p>
        </div>

        <div className='w-1/2'>
          <p>{error}</p>
          <form onSubmit={submitForm}>
            <p>Username:</p>
            <input type="text" name="username" />

            <p>Email:</p>
            <input type="text" name="email" />

            <p>Password:</p>
            <input type="password" name="password" />

            <p>Confirm Password:</p>
            <input type="password" name="confirm-password"/>

            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default index