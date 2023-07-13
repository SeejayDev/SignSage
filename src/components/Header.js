import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { firebase_auth } from '@firebase/config'
import useFirebaseAuth from 'src/hooks/useFirebaseAuth'
import Loading from 'src/icons/Loading'
import { signOut } from 'firebase/auth'
import { useRouter } from 'next/router'

const Header = () => {
  const {user} = useFirebaseAuth()
  const router = useRouter()

  const doLogout = () => {
    signOut(firebase_auth)
    router.push("/")
  }

  return (
    <div className='bg-white w-full'>
      <div className='flex container py-4 items-center justify-between w-full mx-auto max-w-7xl font-poppins'>
        <Link href="/">
          <p className='font-logo text-primary text-3xl select-none'>SignSage</p>
        </Link>
        
        <div className='flex items-center space-x-6 font-medium'>
          {/* Common Links */}
          <Link href="/">Home</Link>
          <Link href="/courses">Courses</Link>

          {user ? (
            <>
              <Link href="/dashboard">
                <button className=''>Dashboard</button>
              </Link>
              <button onClick={doLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login">
                <button className='bg-primary rounded-md px-4 py-2 text-white font-bold tracking-wide'>Login</button>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Header