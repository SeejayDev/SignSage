import Link from 'next/link'
import React from 'react'

const Header = () => {
  return (
    <div className='flex container py-6 items-center justify-between w-full mx-auto'>
      <p className='font-logo text-primary text-3xl select-none'>SignSage</p>
      
      <div className='flex items-center'>
        <Link href="/login">
          <button className='bg-primary rounded-md px-4 py-2 text-white font-bold'>Login</button>
        </Link>
      </div>
    </div>
  )
}

export default Header