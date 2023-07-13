import Header from '@components/Header'
import { firebase_db } from '@firebase/config'
import { collection, getDoc, getDocs, orderBy, query } from 'firebase/firestore'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import RegularContainer from 'src/layouts/RegularContainer'

const courses = () => {
  const [courseList, setCourseList] = useState([])

  const fetchCourses = async () => {
    const querySnapshot = await getDocs(query(collection(firebase_db, 'courses'), orderBy('course_title')));
    let tempList = []
    querySnapshot.forEach((doc) => {
      var course = {...doc.data(), id: doc.id}
      tempList.push(course)
    })

    setCourseList(tempList)
  }

  useEffect(() => {
    fetchCourses()
  }, [])

  return (
    <div className='bg-gray-100 min-h-screen'>
      <Header />

      <div className='bg-primary w-full py-8'>
        <RegularContainer>
          <div className='flex items-center w-full justify-between'>
            <div className='text-white font-medium'>
              <p className='text-4xl font-bold'>Courses</p>
              <p className='mt-2'>Begin your journey into sign language by choosing a course to work on. </p>
              <p className='text-sm'>Each course is a selection of lessons that covers various aspects of practical sign language.</p>
            </div>

            <div className=''>
              <p className='font-asl text-9xl text-white tracking-widest'>courses</p>
            </div>
          </div>
        </RegularContainer>
      </div>

      <RegularContainer>
        <div className='grid grid-cols-3 mt-8 gap-8'>
          {courseList.map((course) => {
            return (
              <Link key={course.id} href={`/courses/${course.id}`}>
                <div className='bg-white rounded-lg shadow-lg w-full h-full overflow-hidden hover:shadow-md hover:shadow-purple-600 transition-shadow'>
                  <div className='w-full aspect-[2/0.8] flex flex-col items-center justify-center text-center p-8 relative bg-purple-600'>
                    <div className='absolute right-3 bottom-3 z-20 flex items-center text-sm bg-white rounded-md px-3 py-1.5 shadow-md'>
                      <p className='text-primary font-bold tracking-wide'>{course.course_lesson_id_list?.length} lessons</p>
                    </div>
                    <p className='font-bold text-2xl z-20 relative text-white'>{course.course_title}</p>
                  </div>
                  <div className='flex items-center'>
                    <div className='p-4'>
                      <p className='line-clamp-3'>{course.course_description}</p>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </RegularContainer>
    </div>
  )
}

export default courses