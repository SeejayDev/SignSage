// Programmer Name  : Mr.Yeoh Cheng Jin, APU, BSc (Hons) in Computer Science (Intelligent Systems)
// Program Name     : dashboard/lessons/create.js
// Description      : To create a new course.
// First Written on : 12 June 2023
// Edited on        : 19 July 2023

import Header from '@components/Header'
import React, { useState } from 'react'
import { Plus } from 'src/icons/Plus'
import { Trash } from 'src/icons/Trash'
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { firebase_db, firebase_storage } from '@firebase/config'
import { addDoc, collection, doc, setDoc } from 'firebase/firestore'
import { useRouter } from 'next/router'
import Loading from 'src/icons/Loading'
import HandposeSelectSingleLine from '@components/HandposeSelectSingleLine'
import HandposeCamera from '@components/HandposeCamera'
import RegularContainer from 'src/layouts/RegularContainer'

const create = () => {
  const [curls, setCurls] = useState([0,0,0,0,0])
  const [directions, setDirections] = useState([0,0,0,0,0])
  const [sways, setSways] = useState([0,0,0,0,0])
  const [images, setImages] = useState([])
  const [errorMessage, setErrorMessage] = useState("")
  const [isCreating, setIsCreating] = useState(false)

  const router = useRouter()

  // input fields
  const updateHeight = (e) => {
    const textarea = e.target
    if (textarea.clientHeight < textarea.scrollHeight) {
      textarea.style.height = "0px"
      textarea.style.height = textarea.scrollHeight + "px"
    }
  }

  const handleUploadImage = (e) => {
    if (e.target.files && e.target.files.length != 0) {
      let chosenImages = [...images]
      for (let i = 0; i < e.target.files.length; i++) {
        chosenImages.push(e.target.files[i])
      }
      setImages(chosenImages)
    }
  }

  const removeImage = (idx) => {
    const tempArr = [...images]
    tempArr.splice(idx, 1)
    setImages(tempArr)
  }

  const createLesson = async (e) => {
    e.preventDefault()

    setIsCreating(true)

    const formData = new FormData(e.target)
    const payload = Object.fromEntries(formData)
    const { title, description, instructions, video_link } = payload

    // validate fields
    if (title === "") {setErrorMessage("Lesson title is required!"); setIsCreating(false); return;}
    if (description === "") {setErrorMessage("Lesson description is required!"); setIsCreating(false); return}
    if (instructions === "") {setErrorMessage("Lesson instructions are required!"); setIsCreating(false); return}
    if (images.length < 1) {setErrorMessage("At least 1 image is required!"); setIsCreating(false); return}

    let uploaded_images = []
    for (let i = 0; i < images.length; i++) {
      const uuid = Math.random().toString(16).slice(2).toString() + new Date().getTime().toString()
      let storageRef = ref(firebase_storage, `images/${uuid}`)
      await uploadBytes(storageRef, images[i]).then(async (snapshot) => {
        return getDownloadURL(snapshot.ref)
      }).then((downloadURL) => {
        uploaded_images[i] = downloadURL
      })
    }

    const newLesson = {
      lesson_title: title,
      lesson_description: description,
      lesson_instructions: instructions,
      lesson_video_link: video_link,
      lesson_images: uploaded_images,
      lesson_pose_curls: curls,
      lesson_pose_directions: directions,
      lesson_pose_sways: sways
    }

    await addDoc(collection(firebase_db, "lessons"), newLesson)
    router.push("/dashboard")
  }

  return (
    <>
      <Header />

      <RegularContainer className="mt-8">
        <div className='flex items-center justify-between'>
          <div className='flex font-bold text-4xl uppercase space-x-2 items-center'>
            <p className="bg-primary p-2 rounded-md text-white">Create</p>
            <p className=''>lesson</p>
          </div>

          <div className='flex items-center space-x-2'>
            <p className='text-red-600 font-medium'>{errorMessage}</p>
            <label htmlFor='submit-form' className='px-4 py-2 cursor-pointer bg-primary text-white rounded-md font-bold hover:shadow-lg hover:shadow-primary/30 transition-shadow' disabled={isCreating}>
              {isCreating ? <Loading className="w-6 h-6 animate-spin" /> : <p>Create</p>}
            </label>
          </div>
        </div>

        <div className='flex w-full mt-8 space-x-8 mb-12'>
          <div className='w-2/5'>
            <form onSubmit={createLesson}>
              <input type='text' name='title' className='rounded-md text-3xl w-full font-bold p-1' placeholder='Lesson Title' />

              <textarea type='text' name='description' className='rounded-md w-full mt-1 p-1 resize-none' placeholder='Lesson Description' rows={1} onChange={(e)=>updateHeight(e)} />

              <div className='w-full mt-6'>
                <p className='font-bold p-1 text-xl'>Instructions: </p>
                <textarea type='text' name='instructions' className='rounded-md w-full p-1 resize-none' placeholder='Content' rows={1} onChange={(e)=>updateHeight(e)} />
              </div>
             
              <div className='w-full p-1 mt-6'>
                <p className='font-bold text-xl'>Images: </p>
                <input type='file' accept='image/*' className='hidden' id='images' multiple onChange={(e)=>handleUploadImage(e)} />
                <div className='grid grid-cols-3 mt-4 gap-4'>
                  {images.map((img, idx)=>(
                    <div key={idx} className='w-full aspect-square relative border rounded-md overflow-hidden cursor-pointer' onClick={()=>removeImage(idx)}>
                      <div className='absolute w-full h-full bg-gray-800 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center'>
                        <Trash className="text-white w-12 h-12" />
                      </div>
  
                      <img src={URL.createObjectURL(img)} className='w-full h-full object-contain' />
                    </div>
                  ))}

                  <label className='aspect-square border rounded-md flex items-center justify-center flex-col cursor-pointer' htmlFor='images'>
                    <Plus className="w-8 h-8" />
                    <p className='mt-2'>Add Images</p>
                  </label>
                </div>
              </div>

              <div className='p-1 mt-6'>
                <p className='font-bold text-xl'>Video Link (optional):</p>
                <input type='text' name='video_link' className='px-4 py-1 border rounded-md mt-2 w-full' />
                <p className='italic text-sm mt-1'>Note: For storage reasons, only YouTube embed links are currently supported by SignSage. Please upload the tutorial video to YouTube and paste the link here.</p>
              </div>

              <input type='submit' className='hidden' id='submit-form' />
            </form>
          </div>

          <div className='w-3/5'>
            <p className='font-bold text-2xl'>Pose Registration</p>
            
            <div className='flex'>
              <div className='w-1/3 relative aspect-square mt-2'> 
                <HandposeCamera setDetectedCurls={setCurls} setDetectedDirections={setDirections} />
              </div>

              <div className='py-4 mx-12 space-y-4'>
                <ol className='list-outside list-decimal'>
                  <li>Use your device's camera to detect the pose values automatically.</li>
                  <li>Click on the X button on the top right to turn off the camera.</li>
                  <li>You can also manually set the values by clicking on them.</li>
                </ol>
              </div>
            </div>
            
            <div className='mt-8 space-y-4'>              
              <HandposeSelectSingleLine
                curls={curls}
                directions={directions}
                sways={sways}
                setCurls={setCurls}
                setDirections={setDirections}
                setSways={setSways}  />
            </div>
          </div>
        </div>
        </RegularContainer>
    </>
  )
}

export default create