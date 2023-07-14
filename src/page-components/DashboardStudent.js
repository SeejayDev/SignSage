import React, { useEffect, useState } from 'react'
import useFirebaseAuth from 'src/hooks/useFirebaseAuth'

const DashboardStudent = () => {
  const { user, userProfile } = useFirebaseAuth()
  const [savedCourseList, setSavedCourseList] = useState([])
  const [savedLessonList, setSavedLessonList] = useState([])

  // wait for the user to load
  // and for the userProfile information to be available
  useEffect(() => {
    if (userProfile) {
      let listOfSavedCoursesIds = userProfile.saved_courses
      let listOfSavedLessonsIds = userProfile.saved_lessons
      console.log(listOfSavedCoursesIds)
      console.log(listOfSavedLessonsIds)
    }
  }, [userProfile])

  return (
    <>
      <div className='flex items-center'>
        <p className='text-2xl font-bold'>My Courses:</p>
        <div className='flex'>

        </div>
      </div>
    </>
  )
}

export default DashboardStudent