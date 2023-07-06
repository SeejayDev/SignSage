import React, { useEffect, useState } from 'react'

const Toggle = (props) => {
  const { handleChange, value = false } = props

  const [checked, setChecked] = useState(false)

  const doToggle = (event) => {
    handleChange(event)
    setChecked(event.target.checked)
  }

  useEffect(()=>{
    setChecked(value)
  }, [])

  return (
    <label className='relative cursor-pointer'>
      <div className={`${checked ? "bg-primary" : "bg-zinc-300"} rounded-full w-16 h-8 relative`}>
        <div className={`bg-white absolute w-6 h-6 rounded-full top-1/2 transform -translate-y-1/2 transition-all left-1 ease-in-out ${checked? "translate-x-8": ""}`}></div>
      </div>
      <input type='checkbox' className='opacity-0 w-0 h-0 absolute' onChange={(e)=>doToggle(e)} />
    </label>
  )
}

export default Toggle