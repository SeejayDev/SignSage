import Header from '@components/Header'
import { firebase_db } from '@firebase/config'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import RegularContainer from 'src/layouts/RegularContainer'

const createCourse = () => {
  const [lessonList, setLessonList] = useState([])
  const [courseLessonList, setCourseLessonList] = useState([])

  const fetchLessons = async () => {
    const querySnapshot = await getDocs(query(collection(firebase_db, 'lessons'), orderBy('lesson_title')));
    let tempList = []
    querySnapshot.forEach((doc) => {
      var lesson = {...doc.data(), id: doc.id}
      tempList.push(lesson)
    })
    //console.log(tempList)
    setLessonList(tempList)
  }

  const addLessonToCourse = () => {

  }

  const removeLessonFromCourse = () => {
    
  }

  useEffect(() => {
    fetchLessons()
  }, [])

  return (
    <div className='min-h-screen flex flex-col'>
      <Header />

      <RegularContainer className="mt-8 flex-1 flex flex-col">
        <div className='flex items-center justify-between'>
          <div className='flex font-bold text-4xl uppercase space-x-2 items-center'>
            <p className="bg-primary p-2 rounded-md text-white">Create</p>
            <p className=''>course</p>
          </div>

          <div>
            <button className='px-4 py-2 bg-primary text-white rounded-md font-bold hover:shadow-lg hover:shadow-primary/30 transition-shadow'>Save Changes</button>
          </div>
        </div>

        <div className='flex mt-8 divide-x-8 divide-primary flex-1 pb-8'>
          <div className='w-1/2 pr-4'>
            <p className='text-xl font-bold'>Lessons in this course:</p>

            <div className='space-y-2'>
              {courseLessonList.length === 0 ? <>
                <p className='ont-medium py-8'>No lessons added to course.</p>
              </> : <>
                {courseLessonList.map((lesson) => {
                  return (
                    <div key={lesson.id} className='flex justify-between rounded-md shadow-lg py-3 px-4 w-full items-center'>
                      <div className='w-1/2'>
                        <p className='text-lg font-bold'>{lesson.lesson_title}</p>
                        <p className='truncate overflow-hidden'>{lesson.lesson_description}</p>
                        <p className='text-xs italic mt-1'>{lesson.id}</p>
                      </div>
                      <div className='flex space-x-2 items-center'>
                        <button 
                          onClick={()=>{removeLessonFromCourse(lesson.id)}}
                          className='border-red-600 text-red-600 hover:bg-red-600 hover:text-white border-2 rounded-md py-1 px-4 text-sm font-bold cursor-pointer'>
                            Remove
                        </button>
                      </div>
                    </div>
                  )
                })}
              </>}
            </div>
          </div>

          <div className='w-1/2 pl-4'>
            <p className='text-xl font-bold pl-4'>All lessons:</p>

            <div className='space-y-2'>
              {lessonList?.map((lesson)=>{
                  return (
                    <div key={lesson.id} className='flex justify-between rounded-md shadow-lg py-3 px-4 w-full items-center'>
                      <div className='w-1/2'>
                        <p className='text-lg font-bold'>{lesson.lesson_title}</p>
                        <p className='truncate overflow-hidden'>{lesson.lesson_description}</p>
                        <p className='text-xs italic mt-1'>{lesson.id}</p>
                      </div>
                      <div className='flex space-x-2 items-center'>
                        <button 
                          onClick={()=>{addLessonToCourse(lesson.id)}}
                          className='border-primary text-primary hover:bg-primary hover:text-white border-2 rounded-md py-1 px-4 text-sm font-bold cursor-pointer'>
                            Add
                        </button>
                      </div>
                    </div>
                  )
                })}
            </div>
          </div>
        </div>
      </RegularContainer>
    </div>
  )
}

export default createCourse