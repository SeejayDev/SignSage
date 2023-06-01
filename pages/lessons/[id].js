import { useRouter } from 'next/router'
import React from 'react'

const ViewLesson = () => {
  const router = useRouter()

  return (
    <div>ViewLesson {router.query.id}</div>
  )
}

export default ViewLesson