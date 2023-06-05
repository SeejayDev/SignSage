import Header from '@components/Header'
import React from 'react'

const create = () => {
  return (
    <>
      <Header />

      <div className='container px-16'>
        <div className='pt-16'>
          <p className='font-bold text-3xl'>Create new lesson</p>
        </div>

        <form>
          <div className='w-full'>
            <p className='px-2'>Lesson Title: </p>
            <input type='text' name='title' className='px-4 py-1 border rounded-md' />
          </div>
          
          <div className='w-full'>
            <p className='px-2'>Lesson Description: </p>
            <textarea type='text' name='title' className='px-4 py-1 border rounded-md w-full' />
          </div>

          <div>
            <p>Instructions:</p>
            <textarea type='text' name='title' className='px-4 py-1 border rounded-md w-full' />
          </div>

          <div className='w-full'>
            <p className='px-2'>Images: </p>
            <input type='text' name='title' className='px-4 py-1 border rounded-md' />
          </div>

          <div>
            <p>Video Link</p>
            <input type='text' name='title' className='px-4 py-1 border rounded-md' />
          </div>

          <div className='w-full'>
            <p className='px-2'>Pose Code: </p>
            <input type='text' name='title' className='px-4 py-1 border rounded-md' />
          </div>
        </form>
      </div>
    </>
  )
}

export default create