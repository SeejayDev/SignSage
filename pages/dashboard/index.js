// Programmer Name  : Mr.Yeoh Cheng Jin, APU, BSc (Hons) in Computer Science (Intelligent Systems)
// Program Name     : dashboard/index.js
// Description      : To view the user dashboard.
// First Written on : 14 June 2023
// Edited on        : 19 July 2023

import Header from '@components/Header'
import Link from 'next/link'
import React, { useEffect } from 'react'
import useFirebaseAuth from 'src/hooks/useFirebaseAuth'
import RegularContainer from 'src/layouts/RegularContainer'
import DashboardStudent from 'src/page-components/DashboardStudent'
import DashboardTeacher from 'src/page-components/DashboardTeacher'

const index = () => {
  const { userProfile } = useFirebaseAuth()

  return (
    <>
      <Header />

      {userProfile &&
      <RegularContainer className="mt-8">
        <div className=''>
          <p className='font-bold text-3xl'>Welcome back, <span className='bg-primary rounded-md p-1 px-2 text-white'>{userProfile?.username}</span></p>
          <p className='mt-3 font-medium'>What would you like to do today?</p>
        </div>

        <div className='mt-4 text-sm grid grid-cols-4 text-center gap-4'>
          {userProfile?.role === "teacher" &&
            <Link href="/dashboard/register">
              <p className='border-2 border-purple-600 hover:bg-purple-600 hover:text-white py-1 rounded-md text-purple-600 font-medium transition-colors'>Register New Teacher Account</p>
            </Link>
          }

          <Link href="/dashboard/profile">
            <p className='border-2 border-purple-600 hover:bg-purple-600 hover:text-white py-1 rounded-md text-purple-600 font-medium transition-colors'>Manage Profile</p>
          </Link>
        </div>

        <div className='mt-12'>
          {userProfile?.role === "teacher" ? <DashboardTeacher />: <DashboardStudent />}
        </div>
      </RegularContainer>
      }
    </>
  )
}

export default index