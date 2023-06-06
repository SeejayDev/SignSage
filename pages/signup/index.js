import React from 'react'

const index = () => {

  const submitForm = async (e) => {
    e.preventDefault()

    const formData = new FormData(e.target)
    const payload = Object.fromEntries(formData)

    console.log(payload)
  }

  return (
    <div className='flex items-center justify-center p-16'>
      <div className='flex '>
        <div className='w-1/2'>
          <p>Create a SignSage account</p>
        </div>

        <div className='w-1/2'>
          <form onSubmit={submitForm}>
            <p>Email:</p>
            <input type="text" id="first" name="first" />

            <p>Password:</p>
            <input type="password" id="last" name="last" />

            <p>Confirm Password:</p>
            <input type="password"/>

            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default index