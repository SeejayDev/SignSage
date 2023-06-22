import CurlSelect from '@components/CurlSelect'
import DirectionSelect from '@components/DirectionSelect'
import Header from '@components/Header'
import Toggle from '@components/Toggle'
import React, { useState } from 'react'

const create = () => {
  const [curls, setCurls] = useState([0,0,0,0,0])
  const [directions, setDirections] = useState([0,0,0,0,0])
  const [sways, setSways] = useState([0,0,0,0,0])

  const fingerList = ["thumb", "index finger", "middle finger", "ring finger", "pinky"]

  const setCurl = (idxToChange, value) => {
    var newCurls = curls.map((curl, idx)=>{
      if (idx === idxToChange) {
        return value
      } else {
        return curl
      }
    })

    setCurls(newCurls)
  }

  const setDirection = (idxToChange, value) => {
    var newDirections = directions.map((direction, idx)=>{
      if (idx === idxToChange) {
        return value
      } else {
        return direction
      }
    })

    setDirections(newDirections)
  }

  const setSway = (idxToChange, checked) => {
    var newSways = sways.map((sway, idx) => {
      if (idx === idxToChange) {
        return checked ? 1 : 0
      } else {
        return sway
      }
    })

    setSways(newSways)
  }

  return (
    <>
      <Header />

      <div className='container max-w-7xl mx-auto font-poppins'>
        <div className='pt-16 flex font-bold text-4xl uppercase'>
          <p className=''>New </p>
          <p className="">lesson</p>
        </div>

        <div className='flex w-full'>
          <div className='w-1/2'>
            <form>
              <div className='w-full'>
                <input type='text' name='title' className='px-4 py-1 border rounded-md' placeholder='Lesson Title' />
              </div>
              
              <div className='w-full'>
                <textarea type='text' name='title' className='px-4 py-1 border rounded-md w-full' placeholder='Lesson Description' />
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

          <div className='w-1/2 space-y-4 text-xl'>
            {fingerList.map((finger, idx)=>{
              return (
                <div key={idx} className='flex items-center justify-between'>
                  <div>
                    <div className='flex items-center'>
                      <p className=''>The {finger} should be</p>
                      <CurlSelect handleChange={(e)=>setCurl(idx, e.target.selectedIndex)} />
                    </div>
      
                    <div className='flex items-center mt-2'>
                      <p>and pointing</p>
                      <DirectionSelect handleChange={(e)=>setDirection(idx, e.target.selectedIndex)} />
                    </div>
                  </div>

                  <div className='flex text-base items-center space-x-2'>
                    <p>Allow sway: </p>
                    <Toggle handleChange={(e)=>setSway(idx, e.target.checked)} />
                  </div>
              </div>
              )
            })}
          <p>{curls.map((c)=>c)}</p>
          <p>{directions.map((c)=>c)}</p>
          <p>{sways.map((c)=>c)}</p>
          </div>
        </div>
        
      </div>
    </>
  )
}

export default create