import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { firebase_auth } from '@firebase/config'
import useFirebaseAuth from 'src/hooks/useFirebaseAuth'
import Loading from 'src/icons/Loading'

const Header = () => {
  const {user, doLogout, authLoading, doLogin} = useFirebaseAuth()

  return (
    <div className='flex container py-4 items-center justify-between w-full mx-auto max-w-7xl font-poppins'>
      <Link href="/">
        <p className='font-logo text-primary text-3xl select-none'>SignSage</p>
      </Link>
      
      <div className='flex items-center space-x-6 font-medium'>
        {/* Common Links */}
        <Link href="/">Home</Link>

        {user ? (
          <>
          <Link href="/dashboard">
            <button className=''>Dashboard</button>
          </Link>
            <p>User ID: {user.uid}</p>
            <button onClick={doLogout}>
              Logout
            </button>
          </>
        ) : (
          <button onClick={()=>doLogin("seejaydev@gmail.com", "GitGudT@k3D3gr33")}>
            Login
          </button>
        )}
       
       {authLoading &&
       <Loading className="animate-spin" /> }

        <Link href="/register">
          <button className='bg-primary rounded-md px-4 py-2 text-white font-bold'>Register</button>
        </Link>
      </div>
    </div>
  )
}

export default Header