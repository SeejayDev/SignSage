import HandposeTest from '@components/HandposeTest'
import Header from '@components/Header'
import { firebase_db } from '@firebase/config'
import { doc, getDoc } from 'firebase/firestore'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useState } from 'react'
import RegularContainer from 'src/layouts/RegularContainer'

const ViewLesson = () => {
  const router = useRouter()
  const [lesson, setLesson] = useState(null)

  const fetchLesson = async (id)=>{
    const docRef = doc(firebase_db, "lessons", id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      setLesson(docSnap.data())
    } else {
      // docSnap.data() will be undefined in this case
      router.replace("/");
    }
  }

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
        <div>
          <div className='flex font-bold text-4xl uppercase space-x-2 items-center'>
            <p className="bg-primary p-2 rounded-md text-white font-bold text-4xl">Lesson</p>
            <p>{lesson.lesson_title}</p>
          </div>

          <p className='rounded-md w-full mt-3 font-medium text-lg'>{lesson.lesson_description}</p>
        </div>

        <div className='flex space-x-8 mt-8'>
          <div className='w-1/2'>
            <div className=''>
              <p className='font-bold text-xl'>Instructions: </p>
              <p className='w-full'>{lesson.lesson_instructions}</p>
            </div>

            <div className='grid grid-cols-4 mt-4 gap-4'>
              {lesson.lesson_images.map((img, idx)=> {
                return (
                  <div key={idx} className='w-full aspect-square relative border rounded-md overflow-hidden'>
                    <img src={img} className='w-full h-full object-cover' />
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
              <HandposeTest curls={lesson.lesson_pose_curls} directions={lesson.lesson_pose_directions} />
          </div>
        </div>
          
      </RegularContainer>
      }
    </>
  )
}

export default ViewLesson