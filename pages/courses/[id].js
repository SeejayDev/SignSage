import Header from '@components/Header'
import { firebase_db } from '@firebase/config'
import { collection, doc, getDoc, getDocs, orderBy, query } from 'firebase/firestore'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { RightArrow } from 'src/icons/RightArrow'
import RegularContainer from 'src/layouts/RegularContainer'

const viewCourse = () => {
  const [course, setCourse] = useState(null)
  const [lessonList, setLessonList] = useState([])
  const router = useRouter()
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
        <RegularContainer>
          <div className='flex items-center w-full justify-between space-x-8'>
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
              <Link key={lesson.id} href={`/lessons/${lesson.id}`}>
                <div className='bg-white rounded-lg shadow-lg w-full h-full overflow-hidden hover:shadow-md hover:shadow-primary transition-shadow'>
                  <div className='w-full aspect-[3/1] flex flex-col items-center justify-center text-center p-8 relative border-4 border-black rounded-lg'>
                    <p className='font-bold text-2xl z-20 relative '>{lesson.lesson_title}</p>
                  </div>
                  <div className='text-center p-4'>
                    <p className='line-clamp-3 font-medium'>{lesson.lesson_description}</p>
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

export default viewCourse