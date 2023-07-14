import Header from '@components/Header'
import { firebase_auth } from '@firebase/config'
import { browserSessionPersistence, setPersistence, signInWithEmailAndPassword } from 'firebase/auth'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import useFirebaseAuth from 'src/hooks/useFirebaseAuth'
import Loading from 'src/icons/Loading'
import RegularContainer from 'src/layouts/RegularContainer'

const login = () => {
  const router = useRouter()
  const [errorMessage, setErrorMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const submitForm = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage("")

    // get data from form object
    const formData = new FormData(e.target)
    const payload = Object.fromEntries(formData)

    const { email, password } = payload

    setPersistence(firebase_auth, browserSessionPersistence).then(() => {
      signInWithEmailAndPassword(firebase_auth, email, password)
        .then((userCredential) => {
          //let user = userCredential.user;
          router.push("/dashboard")
        })
        .catch((error) => {
          //console.log(error.code)
          //let errorCode = error.code 
          setErrorMessage("Invalid email or password.")
        })
    })

    setIsLoading(false)
  }

  return (
    <>
      <Header />

      <RegularContainer>
        <div className='flex mt-8'>
          <div className='w-3/5 flex flex-col pb-4'>
            <p className='font-bold text-4xl text-primary'>Welcome back</p>
            <p className='mt-2 font-medium'>Enter your login details to access your lessons and courses.</p>
            <div className='flex-1 flex flex-col justify-end'>
              <div className='flex items-center space-x-2 text-lg'>
                <p>No account?</p>
                <Link href="/register">
                  <p className='hover:underline font-medium text-primary'>Register an account now.</p>
                </Link>
              </div>
            </div>
          </div>

          <div className='w-2/5 border-4 p-8 rounded-md border-primary'>
            <form onSubmit={submitForm}>
              <div className="flex flex-col space-y-4">
                <input type="email" className="border-2 rounded-md p-2" placeholder="Email" name="email" />

                <input type="password" className="border-2 rounded-md p-2" placeholder="Password" name="password" />

                <button type="submit" className="bg-primary text-white rounded-md py-2 font-bold">
                  {isLoading ? <Loading className="w-6 h-6 animate-spin" /> : <p>Login</p>}
                </button>

                {errorMessage !== "" && <p className='font-medium text-red-600'>{errorMessage}</p> }
              </div>
            </form>
          </div>
        </div>
      </RegularContainer>
    </>
  )
}

export default login