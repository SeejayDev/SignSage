import Header from '@components/Header'
import { firebase_db } from '@firebase/config'
import { addDoc, collection, getDocs, orderBy, query } from 'firebase/firestore'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import Loading from 'src/icons/Loading'
import { SearchIcon } from 'src/icons/SearchIcon'
import RegularContainer from 'src/layouts/RegularContainer'

const create = () => {
  const [fetchedLessonList, setFetchedLessonList] = useState([])
  const [lessonList, setLessonList] = useState([])
  const [courseLessonList, setCourseLessonList] = useState([])
  const [errorMessage, setErrorMessage] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const router = useRouter()

  const fetchLessons = async () => {
    const querySnapshot = await getDocs(query(collection(firebase_db, 'lessons'), orderBy('lesson_title')));
    let tempList = []
    querySnapshot.forEach((doc) => {
      var lesson = {...doc.data(), id: doc.id}
      tempList.push(lesson)
    })

    setFetchedLessonList(tempList)
    setLessonList(tempList)
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

  const addLessonToCourse = (lessonToAdd) => {
    setCourseLessonList((prev) => [...prev, lessonToAdd])
  }

  const removeLessonFromCourse = (lessonToRemove) => {
    let indexOfLesson = courseLessonList.indexOf(lessonToRemove)
    
    let tempArr = [...courseLessonList]
    tempArr.splice(indexOfLesson, 1)
    setCourseLessonList(tempArr)
  }

  const updateHeight = (e) => {
    const textarea = e.target
    if (textarea.clientHeight < textarea.scrollHeight) {
      textarea.style.height = "0px"
      textarea.style.height = textarea.scrollHeight + "px"
    }
  }

  const createCourse = async (e) => {
    e.preventDefault()

    setErrorMessage("")
    setIsCreating(true)

    const formData = new FormData(e.target)
    const payload = Object.fromEntries(formData)
    const { title, description } = payload

    // validate fields
    if (title === "") {setErrorMessage("Course title is required!"); setIsCreating(false); return;}
    if (description === "") {setErrorMessage("Course description is required!"); setIsCreating(false); return}
    if (courseLessonList.length < 1) {setErrorMessage("Select at least 1 lesson!"); setIsCreating(false); return}

    var courseLessonIdList = courseLessonList.map((lesson) => lesson.id)

    const newCourse = {
      course_title: title,
      course_description: description,
      course_lesson_id_list: courseLessonIdList
    }

    await addDoc(collection(firebase_db, "courses"), newCourse)
    router.push("/dashboard")
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

          <div className='flex items-center space-x-2'>
            <p className='text-red-600 font-medium'>{errorMessage}</p>
            <label htmlFor='submit-form' className='px-4 py-2 bg-primary text-white rounded-md font-bold hover:shadow-lg hover:shadow-primary/30 transition-shadow'>
              {isCreating ? <Loading className="w-6 h-6 animate-spin" /> : <p>Save Changes</p>}
            </label>
          </div>
        </div>

        <div className='mt-8'>
          <form onSubmit={createCourse}>
            <input 
              type='text' 
              name='title' 
              className='rounded-md text-3xl w-full font-bold p-1' 
              placeholder='Course Title' 
            />
            
            <textarea 
              type='text' 
              name='description' 
              className='rounded-md w-full mt-1 p-1 resize-none' 
              placeholder='Course Description' 
              rows={1} 
              onChange={(e)=>updateHeight(e)} 
            />

            <input type='submit' className='hidden' id='submit-form' />
          </form>
        </div>

        <div className='flex mt-4 divide-x-8 divide-primary flex-1 pb-8'>
          <div className='w-1/2 pr-4'>
            <p className='text-xl font-bold'>Lessons in this course:</p>

            <div className='space-y-2 mt-5'>
              {courseLessonList.length === 0 ? <>
                <p className='ont-medium mt-4'>No lessons added to course.</p>
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
                          onClick={()=>{removeLessonFromCourse(lesson)}}
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
            <div className='flex items-center justify-between'>
              <p className='text-xl font-bold mr-8'>All lessons:</p>

              <div className='flex-1 border-b-2 flex items-center'>
                <input type='text' onChange={(e)=>filterLessons(e.target.value)} placeholder='Search for lesson' className='w-full py-1 focus:ring-0 focus:outline-none' />
                <SearchIcon className="w-6 h-6" />
              </div>
            </div>

            <div className='space-y-2 mt-4'>
              {lessonList?.map((lesson) => {
                  if (courseLessonList.indexOf(lesson) < 0) {
                    return (
                      <div key={lesson.id} className='flex justify-between rounded-md shadow-lg py-3 px-4 w-full items-center'>
                        <div className='w-1/2'>
                          <p className='text-lg font-bold'>{lesson.lesson_title}</p>
                          <p className='truncate overflow-hidden'>{lesson.lesson_description}</p>
                          <p className='text-xs italic mt-1'>{lesson.id}</p>
                        </div>
                        <div className='flex space-x-2 items-center'>
                          <button 
                            onClick={()=>{addLessonToCourse(lesson)}}
                            className='border-primary text-primary hover:bg-primary hover:text-white border-2 rounded-md py-1 px-4 text-sm font-bold cursor-pointer'>
                              Add
                          </button>
                        </div>
                      </div>
                    )
                  }
                })}
            </div>
          </div>
        </div>
      </RegularContainer>
    </div>
  )
}

export default create