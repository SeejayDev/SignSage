import Header from '@components/Header'
import { firebase_auth, firebase_db } from '@firebase/config'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { collection, doc, getDoc, getDocs, orderBy, query, updateDoc } from 'firebase/firestore'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import useFirebaseAuth from 'src/hooks/useFirebaseAuth'
import { EmptyHeart } from 'src/icons/EmptyHeart'
import { FilledHeart } from 'src/icons/FilledHeart'
import Loading from 'src/icons/Loading'
import { UpwardsArrow } from 'src/icons/UpwardsArrow'
import RegularContainer from 'src/layouts/RegularContainer'

const courses = () => {
  const [courseList, setCourseList] = useState([])
  const [showLoginHint, setShowLoginHint] = useState(false)
  const {user, userProfile, refreshUserProfile} = useFirebaseAuth()

  const fetchCourses = async () => {
    const querySnapshot = await getDocs(query(collection(firebase_db, 'courses'), orderBy('course_title')));
    let tempList = []
    querySnapshot.forEach((doc) => {
      var course = {...doc.data(), id: doc.id}
      tempList.push(course)
    })

    setCourseList(tempList)
  }

  const saveCourse = async (id) => {
    // prompt hint if user is not signed in or a student
    if (!user) {
      setShowLoginHint(true)
      setTimeout(()=> setShowLoginHint(false), 3000)
    } else {
      let existingLikedCourses = []
      if (userProfile.saved_courses) {
        existingLikedCourses = [...userProfile.saved_courses]
      }
      updateDoc(doc(firebase_db, "users", user.uid), {
        saved_courses: [...existingLikedCourses, id]
      }).then(() => {
        refreshUserProfile()
      })
    }
  }

  const unsaveCourse = async (id) => {
    let savedCourses = [...userProfile.saved_courses]
    let idxOfCourseToRemove = savedCourses.indexOf(id)
    savedCourses.splice(idxOfCourseToRemove, 1)

    updateDoc(doc(firebase_db, "users", user.uid), {
      saved_courses: savedCourses
    }).then(() => {
      refreshUserProfile()
    })
  }

  useEffect(() => {
    fetchCourses()
  }, [])

  return (
    <div className='bg-gray-100 min-h-screen'>
      <Header />

      <div className='bg-primary w-full py-8'>
        <RegularContainer>
          <div className='flex items-center w-full justify-between relative'>
            {showLoginHint &&
              <div className='absolute right-0 -top-3 z-20 transform -translate-y-8 flex flex-col items-end px-4 animate-bounce'>
                <UpwardsArrow className="w-8 h-8 text-white" />
                
                <div className='bg-white rounded-md text-center p-2'>
                  <p className='font-medium text-sm'>Create a student account to save courses</p>
                </div>
              </div>
            }

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

      {courseList?.length > 0 ? 
      <RegularContainer>
        <div className='grid grid-cols-3 mt-8 gap-8'>
          {courseList.map((course) => {
            return (
              <div key={course.id} className='bg-white rounded-lg shadow-lg w-full h-full overflow-hidden hover:shadow-md hover:shadow-purple-600 transition-shadow relative'>
                {userProfile?.saved_courses?.indexOf(course.id) >= 0 ?
                  <button className='absolute right-3 top-3 z-20 cursor-pointer' onClick={() => unsaveCourse(course.id)}>
                    <FilledHeart className="w-8 h-8 text-red-700" />
                  </button>
                  :
                  <button className='absolute right-3 top-3 z-20 cursor-pointer' onClick={() => saveCourse(course.id)}>
                    <EmptyHeart className="w-8 h-8 text-white" />
                  </button>
                }

                <Link href={`/courses/${course.id}`}>
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
                </Link>
              </div>
            )
          })}
        </div>
      </RegularContainer> : <>
          <div className='w-full flex flex-col items-center mt-8'>
            <Loading className="animate-spin h-16 w-16 text-primary" />
          </div>
      </> }
    </div>
  )
}

export default courses