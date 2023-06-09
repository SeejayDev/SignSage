import Header from '@components/Header'
import { firebase_db } from '@firebase/config'
import { collection, doc, getDoc, getDocs, orderBy, query, updateDoc } from 'firebase/firestore'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import useFirebaseAuth from 'src/hooks/useFirebaseAuth'
import { EmptyHeart } from 'src/icons/EmptyHeart'
import { Eye } from 'src/icons/Eye'
import { FilledHeart } from 'src/icons/FilledHeart'
import { RightArrow } from 'src/icons/RightArrow'
import { UpwardsArrow } from 'src/icons/UpwardsArrow'
import RegularContainer from 'src/layouts/RegularContainer'

const viewCourse = () => {
  const [course, setCourse] = useState(null)
  const [showLoginHint, setShowLoginHint] = useState(false)
  const [lessonList, setLessonList] = useState([])
  const router = useRouter()
  const {user, userProfile, refreshUserProfile} = useFirebaseAuth() 
  const { id } = router.query

  const fetchCourseDetails = async (id) => {
    const docRef = doc(firebase_db, "courses", id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      let course = {...docSnap.data(), id: docSnap.id}
      setCourse(course)

      // fetch the lessons
      let tempLessonArray = []
      let courseLessonIds = course.course_lesson_id_list
      for (let i = 0; i < courseLessonIds.length; i++) {
        let lessonId = courseLessonIds[i]
        var docSnap2 = await getDoc(doc(firebase_db, "lessons", lessonId))
        if (docSnap2.exists()) {
          let lesson = {...docSnap2.data(), id: docSnap2.id}
          tempLessonArray[i] = lesson
        }
      }
      setLessonList(tempLessonArray)
    } else {
      console.log("No such document!");
    }
  }

  const saveLesson = async (id) => {
    // prompt hint if user is not signed in or a student
    if (!user) {
      setShowLoginHint(true)
      setTimeout(()=> setShowLoginHint(false), 4000)
    } else {
      let existingSavedLessons = []
      if (userProfile.saved_lessons) {
        existingSavedLessons = [...userProfile.saved_lessons]
      }
      updateDoc(doc(firebase_db, "users", user.uid), {
        saved_lessons: [...existingSavedLessons, id]
      }).then(() => {
        refreshUserProfile()
      })
    }
  }

  const unsaveLesson = async (id) => {
    let savedCourses = [...userProfile.saved_lessons]
    let idxOfCourseToRemove = savedCourses.indexOf(id)
    savedCourses.splice(idxOfCourseToRemove, 1)

    updateDoc(doc(firebase_db, "users", user.uid), {
      saved_lessons: savedCourses
    }).then(() => {
      refreshUserProfile()
    })
  }

  // when the component first renders and the ID is loaded, fetch the course and its list of lessons
  useEffect(()=>{
    if (id) {
      fetchCourseDetails(router.query.id)
    }
  }, [id])

  return (
    <div className='bg-gray-100 min-h-screen'>
      <Header />

      <div className='bg-primary w-full py-8'>
        <RegularContainer className="relative">
          {showLoginHint &&
              <div className='absolute right-0 -top-3 z-20 transform -translate-y-8 flex flex-col items-end pr-5 animate-bounce'>
                <UpwardsArrow className="w-8 h-8 text-white" />
                
                <div className='bg-white rounded-md text-center p-2'>
                  <p className='font-medium text-sm'>Create a student account to save lessons</p>
                </div>
              </div>
            }
          <div className='flex items-center w-full justify-between space-x-8 relative'>
          {course ?
            <div className='text-white font-medium'>
              <Link href="/courses">
                <div className='flex items-center hover:underline text-sm'>
                  <RightArrow className="transform rotate-180 w-5 h-5" />
                  <p>Back to courses</p>
                </div>
              </Link>
              <p className='text-4xl font-bold mt-4'>{course.course_title}</p>
              <p className='mt-2'>{course.course_description}</p>
            </div>
          : <div></div>}

            <div className=''>
              <p className='font-asl text-9xl text-white tracking-widest'>course</p>
            </div>
          </div>
        </RegularContainer>
      
      </div> 

      <RegularContainer>
        <div className='grid grid-cols-3 mt-8 gap-8'>
          {lessonList.map((lesson) => {
            return (
              <div key={lesson.id} className='bg-white rounded-lg shadow-lg flex flex-col'>
                <div className='p-4'> 
                  <p className='font-bold text-xl '>{lesson.lesson_title}</p>
                  <p className='text-sm italic line-clamp-3 mt-2'>{lesson.lesson_description}</p>
                </div>
                
                <div className='flex border-t-2 mt-2 divide-x-2 flex-1 w-full' >
                  <Link href={`/lessons/${lesson.id}`} className='w-1/2 flex items-center justify-center text-primary space-x-2 py-3'>
                      <Eye className="w-6 h-6" />
                      <p className='font-bold'>View</p>
                  </Link>

                  {userProfile?.saved_lessons?.indexOf(lesson.id) >= 0 ?
                    <div 
                      className='w-1/2 flex items-center justify-center text-red-600 space-x-2 py-3 cursor-pointer' 
                      onClick={() => unsaveLesson(lesson.id)}>
                      <FilledHeart className="w-6 h-6" />
                      <p className='font-bold'>Liked</p>
                    </div> :
                    <div 
                      className='w-1/2 flex items-center justify-center text-red-600 space-x-2 py-3 cursor-pointer' 
                      onClick={() => saveLesson(lesson.id)}>
                      <EmptyHeart className="w-6 h-6" />
                      <p className='font-bold'>Like</p>
                    </div>
                  }
                </div>
              </div>
            )
          })}
        </div>
      </RegularContainer>
    </div>
  )
}

export default viewCourse