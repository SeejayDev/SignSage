import React, { useState } from 'react'

const CurlSelect = (props) => {
  const { handleChange } = props

  const [curlValue, setCurlValue] = useState("straight")

  const onOptionChange = (e) => {
    handleChange(e)
    setCurlValue(e.target.value)
  }

  return (
    <div className='relative items-center'>
      <button className='bg-black text-white font-medium rounded-md px-2 py-1 ml-2 '>{curlValue}</button>

      <select onChange={onOptionChange} className="absolute left-1/2 top-1/2 p-2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 cursor-pointer text-lg" defaultValue="straight">
        <option>straight</option>
        <option>half-curled</option>
        <option>fully-curled</option>
      </select>
    </div>
  )
}

export default CurlSelect