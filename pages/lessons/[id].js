import { firebase_db } from '@firebase/config'
import { doc, getDoc } from 'firebase/firestore'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useState } from 'react'

const ViewLesson = () => {
  const router = useRouter()
  const [lesson, setLesson] = useState(null)

  const fetchLesson = async (id)=>{
    console.log("fetchlesson ran")
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

  useEffect(()=>{
    if (router.query.id) {
      //console.log(router.query.id)
      fetchLesson(router.query.id)
    }
  }, [id])

  return (
    <div>ViewLesson {router.query.id}</div>
  )
}

export default ViewLesson