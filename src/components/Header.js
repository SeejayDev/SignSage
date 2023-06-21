import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { firebase_auth } from '@firebase/config'
import useFirebaseAuth from 'src/hooks/useFirebaseAuth'
import Loading from 'src/icons/Loading'

const Header = () => {
  const {user, doLogout, authLoading, doLogin} = useFirebaseAuth()

  return (
    <div className='flex container py-6 items-center justify-between w-full mx-auto max-w-7xl'>
      <p className='font-logo text-primary text-3xl select-none'>SignSage</p>
      
      <div className='flex items-center space-x-6'>
        {user ? (
          <>
            <p>User ID: {user.uid}</p>
            <button onClick={doLogout}>
              Logout
            </button>
          </>
        ) : (
          // <Link href="/login">
          //   <button className='bg-primary rounded-md px-4 py-2 text-white font-bold'>Login</button>
          // </Link>
          <button onClick={()=>doLogin("seejaydev@gmail.com", "GitGudT@k3D3gr33")}>
            Login
          </button>
        )}
       
       {authLoading &&
       <Loading className="animate-spin" /> }

        <Link href="/signup">
          <button className='bg-primary rounded-md px-4 py-2 text-white font-bold'>Signup</button>
        </Link>
      </div>
    </div>
  )
}

export default Header