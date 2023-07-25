import React,  { useEffect, useState } from 'react'
import Link from 'next/link'
import { firebase_db, firebase_storage } from '@firebase/config'
import { collection, deleteDoc, doc, getDocs, limit, orderBy, query } from 'firebase/firestore'
import { deleteObject, ref } from 'firebase/storage'
import Loading from 'src/icons/Loading'
import { Plus } from 'src/icons/Plus'

const DashboardTeacher = () => {
  const [fetchedLessonList, setFetchedLessonList] = useState([])
  const [fetchedCourseList, setFetchedCourseList] = useState([])
  const [lessonList, setLessonList] = useState(null)
  const [courseList, setCourseList] = useState(null)

  const fetchLessons = async () => {
    const querySnapshot = await getDocs(query(collection(firebase_db, 'lessons'), orderBy('lesson_title')));
    let tempList = []
    querySnapshot.forEach((doc) => {
      var lesson = {...doc.data(), id: doc.id}
      tempList.push(lesson)
    })
    //console.log(tempList)
    setFetchedLessonList(tempList)
    setLessonList(tempList)
  }

  const fetchCourses = async () => {
    const querySnapshot = await getDocs(query(collection(firebase_db, 'courses'), orderBy('course_title')));
    let tempList = []
    querySnapshot.forEach((doc) => {
      var course = {...doc.data(), id: doc.id}
      tempList.push(course)
    })
    //console.log(tempList)
    setFetchedCourseList(tempList)
    setCourseList(tempList)
  }

  const deleteLesson = async (id) => {
    let lessonToDelete = fetchedLessonList.find((lesson) => lesson.id === id)
    var performDelete = confirm("Are you sure you want to delete lesson: " + lessonToDelete.lesson_title)
    if (performDelete) {
      let lessonToDelete = fetchedLessonList.find((lesson) => lesson.id === id)
      let imagesToDelete = lessonToDelete.lesson_images
      for (let i = 0; i < imagesToDelete.length; i++) {
        let fileRef = ref(firebase_storage, imagesToDelete[i])
        await deleteObject(fileRef).catch((err) => console.log(err))
      }
      await deleteDoc(doc(firebase_db, 'lessons', id))
      fetchLessons()
    }
  }

  const deleteCourse = async (id) => {
    let courseToDelete = fetchedCourseList.find((course) => course.id === id)
    var performDelete = confirm("Are you sure you want to delete course: " + courseToDelete.course_title)
    if (performDelete) {
      await deleteDoc(doc(firebase_db, 'courses', id))
      fetchCourses()
    }
  }

  const filterLessons = (value) => {
    var delayLessonSearch;
    clearTimeout(delayLessonSearch)
    delayLessonSearch = setTimeout(() => {
      let query = value.toUpperCase()
      if (value === "") {
        setLessonList(fetchedLessonList)
      } else {
        let filteredLessons = fetchedLessonList.filter((lesson) => lesson.lesson_title.toUpperCase().indexOf(query) >= 0)
        setLessonList(filteredLessons)
      }
    }, 200)
  }

  const filterCourses = (value) => {
    var delayCourseSearch;
    clearTimeout(delayCourseSearch)
    delayCourseSearch = setTimeout(() => {
      let query = value.toUpperCase()
      if (value === "") {
        setCourseList(fetchedCourseList)
      } else {
        let filteredCourses = fetchedCourseList.filter((course) => course.course_title.toUpperCase().indexOf(query) >= 0)
        setCourseList(filteredCourses)
      }
    }, 200)
  }

  useEffect(()=>{
    fetchLessons()
    fetchCourses()
  }, [])

  return (
    <div className='flex'>
      <div className='w-1/2 pr-4'>
        <div className='flex items-center justify-between'>
          <p className='text-xl font-bold'>Manage Courses</p>
          <Link href="/dashboard/courses/create">
            <div className='flex items-center text-primary border-2 border-primary hover:bg-primary hover:text-white rounded-md px-4 py-2 font-bold space-x-1 justify-center'>
              <p className=''>Create</p>
              <Plus className="w-5 h-5" />
            </div>
          </Link>
        </div>

        <div className='mt-4'>
          <input type='text' onChange={(e)=>filterCourses(e.target.value)} placeholder='Search for course' className='rounded-md p-2 border-2 w-full' />
        </div>

        <div className='space-y-2 mt-4'>
          {!courseList && 
            <div className='flex justify-center py-12'>
              <Loading className="text-primary animate-spin h-8 w-8" />
            </div>
          }
          {courseList?.map((course)=>{
            return (
              <div key={course.id} className='flex justify-between rounded-md shadow-lg py-3 px-4 w-full items-center'>
                <div className='w-1/2'>
                  <p className='text-lg font-bold'>{course.course_title}</p>
                  <p className='truncate overflow-hidden'>{course.course_description}</p>
                  <p className='text-xs italic mt-1'>{course.id}</p>
                </div>
                <div className='flex space-x-2 items-center'>
                  <Link href={`/dashboard/courses/edit/${course.id}`}>
                    <p className='border-primary text-primary hover:bg-primary hover:text-white border-2 rounded-md py-1 px-4 text-sm font-bold cursor-pointer'>Edit</p>
                  </Link>
                  <button 
                    onClick={()=>{deleteCourse(course.id)}}
                    className='border-red-600 text-red-600 hover:bg-red-600 hover:text-white border-2 rounded-md py-1 px-4 text-sm font-bold cursor-pointer'>
                      Delete
                  </button>
                </div>
              </div>
            )
          })}
          
        </div>
      </div>
      
      <div className='w-1/2 pl-4'>
        <div className='flex items-center justify-between'>
          <p className='text-xl font-bold'>Manage Lessons</p>
          <Link href="/dashboard/lessons/create">
            <div className='flex items-center text-primary border-2 border-primary hover:bg-primary hover:text-white rounded-md px-4 py-2 font-bold space-x-1 justify-center'>
              <p className=''>Create</p>
              <Plus className="w-5 h-5" />
            </div>
          </Link>
        </div>

        <div className='mt-4'>
          <input type='text' onChange={(e)=>filterLessons(e.target.value)} placeholder='Search for lesson' className='rounded-md p-2 border-2 w-full' />
        </div>

        <div className='space-y-2 mt-4'>
          {!lessonList && 
            <div className='flex justify-center py-12'>
              <Loading className="text-primary animate-spin h-8 w-8" />
            </div>
          }
          {lessonList?.map((lesson)=>{
            return (
              <div key={lesson.id} className='flex justify-between rounded-md shadow-lg py-3 px-4 w-full items-center'>
                <div className='w-1/2'>
                  <p className='text-lg font-bold'>{lesson.lesson_title}</p>
                  <p className='truncate overflow-hidden'>{lesson.lesson_description}</p>
                  <p className='text-xs italic mt-1'>{lesson.id}</p>
                </div>
                <div className='flex space-x-2 items-center'>
                  <Link href={`/lessons/${lesson.id}`}>
                    <p className='border-primary text-primary hover:bg-primary hover:text-white border-2 rounded-md py-1 px-4 text-sm font-bold cursor-pointer'>View</p>
                  </Link>
                  <Link href={`/dashboard/lessons/edit/${lesson.id}`}>
                    <p className='border-primary text-primary hover:bg-primary hover:text-white border-2 rounded-md py-1 px-4 text-sm font-bold cursor-pointer'>Edit</p>
                  </Link>
                  <button 
                    onClick={()=>{deleteLesson(lesson.id)}}
                    className='border-red-600 text-red-600 hover:bg-red-600 hover:text-white border-2 rounded-md py-1 px-4 text-sm font-bold cursor-pointer'>
                      Delete
                  </button>
                </div>
              </div>
            )
          })}
          
        </div>
      </div>
    </div>
  )
}

export default DashboardTeacher