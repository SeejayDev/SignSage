import Header from '@components/Header'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import useFirebaseAuth from 'src/hooks/useFirebaseAuth'

const index = () => {
  const { user } = useFirebaseAuth()
  const router = useRouter()

  useEffect(()=>{
    if (user?.uid !== "mg2CNbfbVsbGtAKO8hZJ8IhhKw52") {
      router.push("/admin/login")
    }
  }, [])

  return (
    <div>
      <Header />

      {user?.uid !== "mg2CNbfbVsbGtAKO8hZJ8IhhKw52" ? <>
        <p>Login as admin</p>
      </> : <>
        <p>Welcome, admin</p>
      </>}
    </div>
  )
}

export default index