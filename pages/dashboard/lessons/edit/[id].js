import HandposeSelect from '@components/HandposeSelect'
import Header from '@components/Header'
import { firebase_db, firebase_storage } from '@firebase/config'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useState } from 'react'
import Loading from 'src/icons/Loading'
import { Plus } from 'src/icons/Plus'
import { Trash } from 'src/icons/Trash'

const editLesson = () => {
  const [images, setImages] = useState([])
  const [errorMessage, setErrorMessage] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [lesson, setLesson] = useState(null)
  const [imagesToDelete, setImagesToDelete] = useState([])

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

  const removeNewImage = (idx) => {
    const tempArr = [...images]
    tempArr.splice(idx, 1)
    setImages(tempArr)
  }
  const removeExistingImage = (idx) => {
    const tempArr = [...imagesToDelete]
    tempArr.push(lesson.lesson_images[idx])
    setImagesToDelete(tempArr)
  }

  // function to update lesson fields
  const updateLessonState = (e) => {
    setLesson((prev) => ({...prev, [e.target.name]: e.target.value}))
  }

  const setCurls = (curlArray) => {
    setLesson((prev) => ({...prev, lesson_pose_curls: curlArray}))
  }
  const setDirections = (directionArray) => {
    setLesson((prev) => ({...prev, lesson_pose_directions: directionArray}))
  }
  const setSways = (swayArray) => {
    setLesson((prev) => ({...prev, lesson_pose_sways: swayArray}))
  }

  const fetchLesson = useCallback(async (id)=>{
    const docRef = doc(firebase_db, "lessons", id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      //console.log("Document data:", docSnap.data());
      setLesson(docSnap.data())
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
    }
  }, [])

  const {id} = router.query
  useEffect(()=>{
    if (id) {
      //console.log(router.query.id)
      fetchLesson(router.query.id)
    }
  }, [id])

  const updateLesson = async (e) => {
    e.preventDefault()

    setIsCreating(true)

    // validate fields
    if (lesson.lesson_title === "") {setErrorMessage("Lesson title is required!"); setIsCreating(false); return;}
    if (lesson.lesson_description === "") {setErrorMessage("Lesson description is required!"); setIsCreating(false); return}
    if (lesson.lesson_instructions === "") {setErrorMessage("Lesson instructions are required!"); setIsCreating(false); return}
    if ((images.length + lesson.lesson_images.length) < 1) {setErrorMessage("At least 1 image is required!"); setIsCreating(false); return}

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

    for (let i = 0; i < imagesToDelete.length; i++) {
      const imgRef = ref(firebase_storage, imagesToDelete[i]);
      deleteObject(imgRef)
    }

    // update images with new links and remove old links
    lesson.lesson_images = lesson.lesson_images.filter((img) => !imagesToDelete.includes(img))
    lesson.lesson_images = lesson.lesson_images.concat(uploaded_images)

    await setDoc(doc(firebase_db, "lessons", id), lesson)
    router.push("/dashboard")
  }

  return (
    <>
    <Header />

    {lesson ?
      <div className='container max-w-7xl mx-auto font-poppins mt-8'>
        {errorMessage !== "" && 
          <div className='bg-red-500 text-white font-bold px-4 py-2 rounded-md mb-4 flex justify-between items-center'>
            <p className=''>{errorMessage}</p>
            <Plus className="rotate-45 w-8 h-8 cursor-pointer" onClick={()=>setErrorMessage("")} />
          </div>
        }

        <div className='flex font-bold text-4xl uppercase space-x-2 items-center'>
          <p className="bg-primary p-2 rounded-md text-white">Edit</p>
          <p className=''>lesson</p>
        </div>

        <div className='flex w-full mt-8 space-x-8 mb-12'>
          <div className='w-1/2'>
            <form onSubmit={updateLesson}>
              <input 
                type='text' 
                name='lesson_title' 
                className='rounded-md text-3xl w-full font-bold p-1' 
                placeholder='Lesson Title' 
                value={lesson.lesson_title}
                onChange={updateLessonState} />

              <textarea 
                type='text' 
                name='lesson_description' 
                className='rounded-md w-full mt-1 p-1 resize-none' 
                placeholder='Lesson Description' 
                rows={1}
                value={lesson.lesson_description}
                onChange={updateLessonState} />

              <div className='w-full mt-4'>
                <p className='font-bold p-1 text-xl'>Instructions: </p>
                <textarea 
                  type='text' 
                  name='lesson_instructions' 
                  className='rounded-md w-full p-1 resize-none' 
                  placeholder='Content' 
                  rows={1} 
                  value={lesson.lesson_instructions}
                  onChange={(e)=>{
                    updateHeight(e)
                    updateLessonState(e)
                  }} />
              </div>
            
              <div className='w-full p-1 mt-4'>
                <p className='font-bold text-xl'>Images: </p>
                <input type='file' accept='image/*' className='hidden' id='images' multiple onChange={(e)=>handleUploadImage(e)} />
                <div className='grid grid-cols-4 mt-4 gap-4'>
                  {lesson.lesson_images.map((img, idx)=> {
                    if (imagesToDelete.indexOf(img) < 0) {
                      return (
                        <div key={idx} className='w-full aspect-square relative border rounded-md overflow-hidden cursor-pointer' onClick={()=>removeExistingImage(idx)}>
                          <div className='absolute w-full h-full bg-gray-800 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center'>
                            <Trash className="text-white w-12 h-12" />
                          </div>

                          <img src={img} className='w-full h-full object-cover' />
                        </div>
                      )
                    }
                  })}
                  {images.map((img, idx)=>(
                    <div key={idx} className='w-full aspect-square relative border rounded-md overflow-hidden cursor-pointer' onClick={()=>removeNewImage(idx)}>
                      <div className='absolute w-full h-full bg-gray-800 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center'>
                        <Trash className="text-white w-12 h-12" />
                      </div>

                      <img src={URL.createObjectURL(img)} className='w-full h-full object-cover' />
                    </div>
                  ))}

                  <label className='aspect-square border rounded-md flex items-center justify-center flex-col cursor-pointer' htmlFor='images'>
                    <Plus className="w-8 h-8" />
                    <p className='mt-2'>Add Images</p>
                  </label>
                </div>
              </div>

              <div className='p-1 mt-4'>
                <p className='font-bold text-xl'>Video Link:</p>
                <input 
                  type='text' 
                  name='lesson_video_link' 
                  className='px-4 py-1 border rounded-md mt-2 w-full'
                  value={lesson.lesson_video_link}
                  onChange={updateLessonState} />
              </div>

              
              <button type='submit' className='mt-8 bg-primary rounded-md w-1/2 text-white py-2 font-bold flex justify-center' disabled={isCreating}>
                {isCreating ? <Loading className="w-6 h-6 animate-spin" /> : <p>Save Changes</p>}
              </button>
            </form>
          </div>

          <div className='w-1/2 space-y-4 text-xl'>
            <HandposeSelect
                curls={lesson.lesson_pose_curls}
                directions={lesson.lesson_pose_directions}
                sways={lesson.lesson_pose_sways}
                setCurls={setCurls}
                setDirections={setDirections}
                setSways={setSways}  />
          </div>
        </div>
        
      </div>
    : 
      <div className='container flex justify-center mx-auto'>
        <Loading className="w-12 h-12 animate-spin text-primary" />
      </div>
    }
  </>
  )
}

export default editLesson