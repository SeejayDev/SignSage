import Header from '@components/Header'
import { firebase_db, firebase_storage } from '@firebase/config'
import { collection, deleteDoc, doc, getDocs, limit, orderBy, query } from 'firebase/firestore'
import { deleteObject, ref } from 'firebase/storage'
import Link from 'next/link'
import React, { useCallback, useEffect, useState } from 'react'
import Loading from 'src/icons/Loading'
import { Plus } from 'src/icons/Plus'
import RegularContainer from 'src/layouts/RegularContainer'

const index = () => {
  const [lessonList, setLessonList] = useState(null)

  const fetchLessons = useCallback(async () => {
    const querySnapshot = await getDocs(query(collection(firebase_db, 'lessons'), orderBy('lesson_title'), limit(15)));
    let tempList = []
    querySnapshot.forEach((doc) => {
      var lesson = {...doc.data(), id: doc.id}
      tempList.push(lesson)
    })
    console.log(tempList)
    setLessonList(tempList)
  }, [])

  const deleteLesson = async (id) => {
    var performDelete = confirm("Are you sure you want to delete Lesson: " + id)
    if (performDelete) {
      let lessonToDelete = lessonList.find((lesson) => lesson.id === id)
      let imagesToDelete = lessonToDelete.lesson_images
      for (let i = 0; i < imagesToDelete.length; i++) {
        let fileRef = ref(firebase_storage, imagesToDelete[i])
        await deleteObject(fileRef).catch((err) => console.log(err))
      }
      await deleteDoc(doc(firebase_db, 'lessons', id))
      fetchLessons()
    }
  }
  
  useEffect(()=>{
    fetchLessons()
  }, [])

  return (
    <>
      <Header />

      <RegularContainer className="mt-8 ">
        <p className='font-bold text-3xl'>Welcome back, <span className='bg-primary rounded-md p-1 px-2 text-white'>Username</span></p>
        <p className='mt-3 font-medium'>What would you like to do today?</p>
        <div className='flex items-center space-x-4 mt-4'>
          <p className='font-bold rounded-full px-4 py-0.5 bg-purple-600 text-white text-sm'>Teacher</p>
        </div>

        <div className='mt-8 flex space-x-8'>
          <div className='w-1/2'>
            <div className='flex items-center justify-between'>
              <p className='text-xl font-bold'>Manage Courses</p>
              <Link href="/dashboard/courses/create">
                <div className='flex items-center text-primary border-2 border-primary hover:bg-primary hover:text-white rounded-md px-4 py-2 font-bold space-x-1 justify-center'>
                  <p className=''>Create</p>
                  <Plus className="w-5 h-5" />
                </div>
              </Link>
            </div>
          </div>
          
          <div className='w-1/2'>
            <div className='flex items-center justify-between'>
              <p className='text-xl font-bold'>Manage Lessons</p>
              <Link href="/dashboard/lessons/create">
                <div className='flex items-center text-primary border-2 border-primary hover:bg-primary hover:text-white rounded-md px-4 py-2 font-bold space-x-1 justify-center'>
                  <p className=''>Create</p>
                  <Plus className="w-5 h-5" />
                </div>
              </Link>
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
      </RegularContainer>
    </>
  )
}

export default index