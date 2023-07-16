import { firebase_db } from '@firebase/config'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import useFirebaseAuth from 'src/hooks/useFirebaseAuth'
import { EmptyHeart } from 'src/icons/EmptyHeart'
import { Eye } from 'src/icons/Eye'
import { FilledHeart } from 'src/icons/FilledHeart'
// import function to register Swiper custom elements
import { register } from 'swiper/element/bundle';
// register Swiper custom elements
register();

const DashboardStudent = () => {
  const { user, userProfile, refreshUserProfile } = useFirebaseAuth()
  const [savedCourseList, setSavedCourseList] = useState([])
  const [savedLessonList, setSavedLessonList] = useState([])
  const [completedLessonIdList, setCompletedLessonIdList] = useState([])

  const fetchSavedCourses = async (courseIdList) => {
    // get the saved courses
    let tempCourseArray = []
    for (let i = 0; i < courseIdList.length; i++) {
      const docSnap = await getDoc(doc(firebase_db, "courses", courseIdList[i]))

      // calculate course progress
      let listOfCompletedLessonsIds = []
      if (userProfile.completed_lessons) {
        listOfCompletedLessonsIds = [...userProfile.completed_lessons]
      }
      let listOfLessonIdsInCourse = docSnap.data().course_lesson_id_list
      let completedLessonsInCourse = listOfLessonIdsInCourse.filter((lessonId) => listOfCompletedLessonsIds.includes(lessonId))

      let progress = Math.round((completedLessonsInCourse.length / listOfLessonIdsInCourse.length) * 100)
      tempCourseArray[i] = {...docSnap.data(), id: docSnap.id, course_progress: `${progress}%`}
    }

    setSavedCourseList(tempCourseArray)
  }

  const fetchSavedLessons = async (lessonIdList) => {
    // get the saved courses
    let tempLessonArray = []
    for (let i = 0; i < lessonIdList.length; i++) {
      const docSnap = await getDoc(doc(firebase_db, "lessons", lessonIdList[i]))
      tempLessonArray[i] = {...docSnap.data(), id: docSnap.id}
    }

    setSavedLessonList(tempLessonArray)
  }

  const unsaveCourse = async (id) => {
    let savedCourses = [...userProfile.saved_courses]
    let idxOfCourseToRemove = savedCourses.indexOf(id)

    let doUnsave = confirm("Are you sure you want to remove " + savedCourseList[idxOfCourseToRemove].course_title + " from your saved courses?")
    if (doUnsave) {
      savedCourses.splice(idxOfCourseToRemove, 1)
  
      updateDoc(doc(firebase_db, "users", user.uid), {
        saved_courses: savedCourses
      }).then(() => {
        refreshUserProfile()
      })
    }
  }

  const unsaveLesson = async (id) => {
    let savedLessons = [...userProfile.saved_lessons]
    let idxOfLessonToRemove = savedLessons.indexOf(id)
  
    let doUnsave = confirm("Are you sure you want to remove " + savedLessonList[idxOfLessonToRemove].lesson_title + " from your saved lessons?")
    if (doUnsave) {
      savedLessons.splice(idxOfLessonToRemove, 1)
  
      updateDoc(doc(firebase_db, "users", user.uid), {
        saved_lessons: savedLessons
      }).then(() => {
        refreshUserProfile()
      })
    }
  }

  // wait for the user to load
  // and for the userProfile information to be available
  useEffect(() => {
    if (userProfile) {
      let listOfSavedCoursesIds = userProfile.saved_courses
      let listOfSavedLessonsIds = userProfile.saved_lessons

      fetchSavedCourses(listOfSavedCoursesIds)
      fetchSavedLessons(listOfSavedLessonsIds)
    }
  }, [userProfile])

  return (
    <>
      <div className='flex items-center'>
        <p className='text-2xl font-bold'>My Courses:</p>
      </div>

      <div className='mt-2'>
        <swiper-container
          slides-per-view="3.2">
          {savedCourseList.map((course) => {
            return (
              <swiper-slide style={{height: "auto", padding: "10px"}} key={course.id}>
                <div className='w-full h-full flex flex-col'>
                  <div className='bg-white flex flex-col flex-1 rounded-lg shadow-md w-full overflow-hidden hover:shadow-md  hover:shadow-purple-600 transition-shadow relative'>
                    <button className='absolute right-3 top-3 z-20 cursor-pointer' onClick={() => unsaveCourse(course.id)}>
                      <FilledHeart className="w-8 h-8 text-red-400" />
                    </button>

                    <Link href={`/courses/${course.id}`} className='flex-1 flex flex-col'>
                      <div className='w-full aspect-[2/0.8] flex flex-col items-center justify-center text-center p-8 relative bg-purple-600'>
                        <div className='absolute right-3 bottom-3 z-20 flex items-center text-sm bg-white rounded-md px-3 py-1.5 shadow-md'>
                          <p className='text-primary font-bold tracking-wide'>{course.course_lesson_id_list?.length} lessons</p>
                        </div>
                        <p className='font-bold text-2xl z-20 relative text-white'>{course.course_title}</p>
                      </div>
                      <div className='flex items-center flex-1'>
                        <div className='p-4'>
                          <p className='line-clamp-3'>{course.course_description}</p>
                        </div>
                      </div>
                    </Link>
                  </div>

                  <div className='flex items-center mt-3 space-x-3 px-2'>
                    <p className='font-medium text-sm'>Progress:</p>
                    <div className='relative bg-zinc-200 flex-1 rounded-full h-2'>
                      <div className='absolute h-full bg-primary rounded-full' style={{width: course.course_progress}}></div>
                    </div>
                    <p className='text-sm'>{course.course_progress}</p>
                  </div>
                </div>
              </swiper-slide>
            )
          })}
        </swiper-container>
      </div>

      <div className='flex items-center mt-8'>
        <p className='text-2xl font-bold'>My Lessons:</p>
      </div>

      <div className='mt-2'>
        <swiper-container
          slides-per-view="3.2">
            {savedLessonList.map((lesson) => {
              return (
                <swiper-slide key={lesson.id} style={{height: "auto", padding: "10px"}}>
                  <div className='bg-white rounded-lg shadow-md flex flex-col'>
                    <div className='p-4'> 
                      <p className='font-bold text-xl'>{lesson.lesson_title}</p>
                      <p className='text-sm italic line-clamp-3 mt-2'>{lesson.lesson_description}</p>
                    </div>
                    
                    <div className='flex border-t-2 mt-2 divide-x-2 flex-1 w-full' >
                      <Link href={`/lessons/${lesson.id}`} className='w-1/2 flex items-center justify-center text-primary space-x-2 py-3'>
                          <Eye className="w-6 h-6" />
                          <p className='font-bold'>View</p>
                      </Link>

                      {userProfile?.saved_lessons?.indexOf(lesson.id) >= 0 &&
                        <div
                          className='w-1/2 flex items-center justify-center text-red-600 space-x-2 py-3 cursor-pointer' 
                          onClick={() => unsaveLesson(lesson.id)}>
                          <FilledHeart className="w-6 h-6" />
                          <p className='font-bold'>Liked</p>
                        </div>
                      }
                    </div>
                  </div>
                </swiper-slide>
              )
            })}

        </swiper-container>
      </div>
    </>
  )
}

export default DashboardStudent