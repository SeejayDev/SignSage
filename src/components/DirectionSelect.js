import React, { useEffect, useState } from 'react'
import { directionOptions } from 'src/posedetection/FingerposeValues'

const DirectionSelect = (props) => {
  const { handleChange, value = 0 } = props

  const [directionIndex, setDirectionIndex] = useState(value)

  const onOptionChange = (e) => {
    handleChange(e)
    setDirectionIndex(e.target.selectedIndex)
  }

  useEffect(() => {
    setDirectionIndex(value)
  }, [value])

  return (
    <div className='relative items-center'>
      <div className='flex items-center ml-2 space-x-2'>
        <p className='bg-primary text-white font-medium rounded-md px-2 py-1'>{directionOptions[directionIndex].orientation}</p>

        {directionOptions[directionIndex].direction && 
          <>
            <p>to the</p>
            <p className='bg-primary text-white font-medium rounded-md px-2 py-1'>{directionOptions[directionIndex].direction}</p>
          </>
        }
      </div>

      <select onChange={onOptionChange} value={directionIndex} className="absolute left-1/2 top-1/2 w-full h-full transform -translate-x-1/2 -translate-y-1/2 opacity-0 cursor-pointer text-lg">
        {directionOptions.map((d, idx)=>{
          return <option key={d.id} value={idx}>{d.orientation} {d.direction ? "to the " + d.direction : ""}</option>
        })}
      </select>
    </div>
  )
}

export default DirectionSelect