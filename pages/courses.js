import Header from '@components/Header'
import React from 'react'
import RegularContainer from 'src/layouts/RegularContainer'

const courses = () => {
  return (
    <>
      <Header />

      <div className='bg-primary w-full py-8'>
        <RegularContainer>
          <div className='flex items-center w-full justify-between'>
            <div className='text-white font-medium'>
              <p className='text-4xl font-bold'>Courses</p>
              <p className='mt-2'>Begin your journey into sign language by choosing a course to work on. </p>
              <p className='text-sm'>Each course is a selection of lessons that covers various aspects of practical sign language.</p>
            </div>

            <div className=''>
              <p className='font-asl text-9xl text-white tracking-widest'>courses</p>
            </div>
          </div>
        </RegularContainer>
      </div>

    </>
  )
}

export default courses