import React, { useEffect, useState } from 'react'

const CurlSelect = (props) => {
  const { handleChange, value = 0 } = props

  const curlOptions = ["straight", "half-curled", "fully-curled"]
  const [curlIndex, setCurlIndex] = useState(value)

  const onOptionChange = (e) => {
    handleChange(e)
    setCurlIndex(e.target.selectedIndex)
  }

  useEffect(() => {
    setCurlIndex(value)
  }, [value])

  return (
    <div className='relative items-center'>
      <button className='bg-black text-white font-medium rounded-md px-2 py-1 ml-2 '>{curlOptions[curlIndex]}</button>

      <select onChange={onOptionChange} className="absolute left-1/2 top-1/2 p-2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 cursor-pointer text-lg" defaultValue={curlOptions[value]}>
        {curlOptions.map((curl, idx) => <option key={idx}>{curl}</option>)}
      </select>
    </div>
  )
}

export default CurlSelect