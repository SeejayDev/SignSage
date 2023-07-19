// Programmer Name  : Mr.Yeoh Cheng Jin, APU, BSc (Hons) in Computer Science (Intelligent Systems)
// Program Name     : lessons/[id].js
// Description      : To view a lesson's details.
// First Written on : 16 June 2023
// Edited on        : 19 July 2023

import HandposeTest from '@components/HandposeTest'
import Header from '@components/Header'
import { firebase_db } from '@firebase/config'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useState } from 'react'
import useFirebaseAuth from 'src/hooks/useFirebaseAuth'
import { CheckmarkCircle } from 'src/icons/CheckmarkCircle'
import { EmptyHeart } from 'src/icons/EmptyHeart'
import { FilledHeart } from 'src/icons/FilledHeart'
import Loading from 'src/icons/Loading'
import RegularContainer from 'src/layouts/RegularContainer'

const ViewLesson = () => {
  const router = useRouter()
  const [lesson, setLesson] = useState(null)
  const [stepsMatched, setStepsMatched] = useState(0)
  const [poseMatched, setPoseMatched] = useState(false)
  const [showLoginHint, setShowLoginHint] = useState(false)
  const [markingAsCompleted, setMarkingAsCompleted] = useState(false)
  const {user, userProfile, refreshUserProfile} = useFirebaseAuth()

  const fetchLesson = async (id)=>{
    const docRef = doc(firebase_db, "lessons", id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      //console.log("Document data:", docSnap.data());
      setLesson(docSnap.data())
    } else {
      // docSnap.data() will be undefined in this case
      router.replace("/");
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
    let savedLessons = [...userProfile.saved_lessons]
    let idxOfCourseToRemove = savedLessons.indexOf(id)
    savedLessons.splice(idxOfCourseToRemove, 1)

    updateDoc(doc(firebase_db, "users", user.uid), {
      saved_lessons: savedLessons
    }).then(() => {
      refreshUserProfile()
    })
  }

  const saveCompletedLesson = async (id) => {
    setMarkingAsCompleted(true)
    let existingCompletedLessons = []
    if (userProfile.completed_lessons) {
      existingCompletedLessons = [...userProfile.completed_lessons]
    }

    updateDoc(doc(firebase_db, "users", user.uid), {
      completed_lessons: [...existingCompletedLessons, id]
    }).then(() => {
      refreshUserProfile()
      setMarkingAsCompleted(false)
    })
  }

  useEffect(() => {
    if (stepsMatched === 10) {
      setPoseMatched(true)
    }
  }, [stepsMatched])

  const {id} = router.query
  useEffect(()=>{
    if (id) {
      //console.log(router.query.id)
      fetchLesson(router.query.id)
    }
  }, [id])

  return (
    <>
      <Header />
      
      {lesson && 
      <RegularContainer className="mt-8">
        <div className='flex items-center'>
          <div className='flex-1'>
            <div className='flex font-bold text-4xl uppercase space-x-2 items-center'>
              <p className="bg-primary p-2 rounded-md text-white font-bold text-4xl">Lesson</p>
              <p>{lesson.lesson_title}</p>
            </div>

            <p className='rounded-md w-full mt-3 font-medium text-lg'>{lesson.lesson_description}</p>
          </div>

          <div>
            {userProfile ?
              <>
                {userProfile?.saved_lessons?.indexOf(id) >= 0 ? 
                  <FilledHeart className="w-8 h-8 text-red-600 cursor-pointer hover:scale-125 transition-all" onClick={() => unsaveLesson(id)} /> : 
                  <EmptyHeart className="w-8 h-8 text-red-600 cursor-pointer hover:scale-125 transition-all" onClick={() => saveLesson(id)} />
                }
              </> : <></>}
          </div>
        </div>

        <div className='flex space-x-8 mt-8'>
          <div className='w-1/2'>
            <div className=''>
              <p className='font-bold text-xl'>Instructions: </p>
              <p className='w-full whitespace-pre-wrap'>{lesson.lesson_instructions}</p>
            </div>

            <div className='grid grid-cols-3 mt-4 gap-4'>
              {lesson.lesson_images.map((img, idx)=> {
                return (
                  <div key={idx} className='w-full aspect-square relative border rounded-md overflow-hidden'>
                    <img src={img} className='w-full h-full object-contain' />
                  </div>
                )
              })}
            </div>

            <div className='mt-8 relative'>
              {lesson.lesson_video_link !== "" &&
                <iframe className='w-full aspect-video rounded-md border-primary border-8' src={lesson.lesson_video_link}></iframe>
              }
            </div>
          </div>

          <div className='w-1/2 flex flex-col'>
            <div className='w-72 xl:w-96 mx-auto'>
              <HandposeTest 
                curls={lesson.lesson_pose_curls} 
                directions={lesson.lesson_pose_directions} 
                sways={lesson.lesson_pose_sways}
                setStepsMatched={setStepsMatched} />

              {userProfile?.completed_lessons?.includes(id) ?
                <div className='mt-6 flex items-center text-white relative bg-primary rounded-md p-4 overflow-hidden shadow-lg'>
                  <p className='font-bold '>Lesson Completed</p>
                  <CheckmarkCircle className="w-20 h-20 absolute -top-2 right-0 rotate-12" />
                </div> : <>
                  <div className='flex space-x-4 mt-6 items-center'>
                    <p className='w-1/2 text-xl font-bold'>
                      <span className='text-primary'>{Math.round((stepsMatched / 10) * 100)}%</span> matched
                    </p>
                    
                    {user &&
                      <button 
                        className={`w-1/2 rounded-md p-2 text-center font-bold text-white ${poseMatched ? "bg-primary" : "bg-zinc-300"}`} 
                        disabled={!poseMatched || markingAsCompleted}
                        onClick={()=>saveCompletedLesson(id)}>
                          {markingAsCompleted ? <Loading className="animate-spin w-5 h-5 mx-auto" /> : <p>Mark Lesson Complete</p>}
                      </button>
                    }
                  </div>
                </>}
            </div>
          </div>
        </div>
          
      </RegularContainer>
      }
    </>
  )
}

export default ViewLesson