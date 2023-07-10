import React from 'react'
import CurlSelect from './CurlSelect'
import DirectionSelect from './DirectionSelect'
import Toggle from './Toggle'

const HandposeSelectSingleLine = (props) => {
  const fingerList = ["thumb", "index finger", "middle finger", "ring finger", "pinky"]

  const { 
    curls = [0,0,0,0,0], 
    setCurls, 
    directions = [0,0,0,0,0], 
    setDirections, 
    sways = [0,0,0,0,0], 
    setSways } = props

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
      {fingerList.map((finger, idx)=>{
        return (
          <div key={idx} className='flex items-center justify-between'>
            <div>
              <div className='flex items-center flex-wrap'>
                <p className=''>The {finger} should be</p>
                <CurlSelect handleChange={(e)=>setCurl(idx, e.target.selectedIndex)} value={curls[idx]} />
                <p className='ml-2'>and pointing</p>
                <DirectionSelect handleChange={(e)=>setDirection(idx, e.target.selectedIndex)} value={directions[idx]} />
              </div>
            </div>
        </div>
        )
      })}

      <div>
        <p className='font-bold text-xl'>Sway Toggles:</p>
        <div className='text-sm italic mt-2'>
          <p>The detection is strict when detecting directions facing exactly upwards, downwards, or sideways.</p>
          <p> If the finger can sway a little diagonally, toggle the option on.</p>
        </div>
        <div className='grid grid-cols-5 gap-4 mt-4'>
          {fingerList.map((finger, idx) => {
            return (
              <label key={idx} className='flex flex-col items-center text-center border-primary border-2 rounded-md p-2 cursor-pointer'>
                <p className='text-sm font-medium mb-2'>{finger}</p>
                <Toggle handleChange={(e)=>setSway(idx, e.target.checked)} value={sways[idx]} />
              </label>
            )
          })}
        </div>
        
      </div>

    </>
  )
}

export default HandposeSelectSingleLine