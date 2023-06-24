import React from 'react'

const RegularContainer = (props) => {
  return (
    <div className={`container max-w-7xl mx-auto font-poppins ${props.className}`}>
      {props.children}
    </div>
  )
}

export default RegularContainer