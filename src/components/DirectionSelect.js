import React, { useState } from 'react'

const DirectionSelect = (props) => {
  const { handleChange } = props

  const [directionIndex, setDirectionIndex] = useState(0)

  const onOptionChange = (e) => {
    handleChange(e)
    setDirectionIndex(e.target.selectedIndex)
  }

  const directionOptions = [
    { id: "diOp1", orientation: "upwards", direction: null },
    { id: "diOp2", orientation: "downwards", direction: null },
    { id: "diOp3", orientation: "horizontally", direction: "left" },
    { id: "diOp4", orientation: "horizontally", direction: "right" },
    { id: "diOp5", orientation: "upwards", direction: "right" },
    { id: "diOp6", orientation: "upwards", direction: "left" },
    { id: "diOp7", orientation: "downwards", direction: "right" },
    { id: "diOp8", orientation: "downwards", direction: "left" },
  ]

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

      <select onChange={onOptionChange} className="absolute left-1/2 top-1/2 w-full h-full transform -translate-x-1/2 -translate-y-1/2 opacity-0 cursor-pointer text-lg" defaultValue="Vertical Up">
        {directionOptions.map((d)=>{
          return <option key={d.id}>{d.orientation} {d.direction ? "to the " + d.direction : ""}</option>
        })}
      </select>
    </div>
  )
}

export default DirectionSelect