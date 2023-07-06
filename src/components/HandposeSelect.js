import React from 'react'
import CurlSelect from './CurlSelect'
import DirectionSelect from './DirectionSelect'
import Toggle from './Toggle'

const HandposeSelect = (props) => {
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
              <div className='flex items-center'>
                <p className=''>The {finger} should be</p>
                <CurlSelect handleChange={(e)=>setCurl(idx, e.target.selectedIndex)} value={curls[idx]} />
              </div>

              <div className='flex items-center mt-2'>
                <p>and pointing</p>
                <DirectionSelect handleChange={(e)=>setDirection(idx, e.target.selectedIndex)} value={directions[idx]} />
              </div>
            </div>

            <div className='flex text-base items-center space-x-2'>
              <p>Allow sway: </p>
              <Toggle handleChange={(e)=>setSway(idx, e.target.checked)} value={sways[idx]} />
            </div>
        </div>
        )
      })}
    </>
  )
}

export default HandposeSelect