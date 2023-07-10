import React, { useEffect, useRef, useState } from 'react'
import Webcam from 'react-webcam'
import { Camera } from 'src/icons/Camera'
import { Plus } from 'src/icons/Plus';
import HandposeCamera from './HandposeCamera';

const HandposeTest = (props) => {
  const { curls = [0,0,0,0,0], directions = [0,0,0,0,0], sways = [0,0,0,0,0] } = props
  const [activated, setActivated] = useState(false)
  const [detectedCurls, setDetectedCurls] = useState([])
  const [detectedDirections, setDetectedDirections] = useState([])
  const [testResults, setTestResults] = useState([false, false, true, false, false])
  const fingerList = ["thumb", "index", "middle", "ring", "pinky"]

  // write a function that accepts two values representing the desired direction and the detected direction
  // if the values do not match, check if sway is accepted and check if it matches any of the sway directions
  // return false or true in the end

  // 0: 'Vertical Up',
  // 1: 'Vertical Down',
  // 2: 'Horizontal Left',
  // 3: 'Horizontal Right',
  // 4: 'Diagonal Up Right',
  // 5: 'Diagonal Up Left',
  // 6: 'Diagonal Down Right',
  // 7: 'Diagonal Down Left',

  // Logic: If directions[i] === 0, allow for 4 and 5
  // Logic: If directions[i] === 1, allow for 6 and 7
  // Logic: If directions[i] === 2, allow for 5 and 7
  // Logic: If directions[i] === 3, allow for 4 and 6
  const checkDirectionWithSway = (lessonDirection, detectedDirection) => {
    let directionArray = []
    directionArray.push(lessonDirection)

    switch (lessonDirection) {
      case 0: directionArray.push(4,5); break;
      case 1: directionArray.push(6,7); break;
      case 2: directionArray.push(5,7); break;
      case 3: directionArray.push(4,6); break;
    }
    
    return directionArray.includes(detectedDirection)
  }

  useEffect(()=> {
    let testResults = []
    for (let i = 0; i < 5; i++) {
      if (checkDirectionWithSway(directions[i], detectedDirections[i]) && detectedCurls[i] === curls[i]) {
        testResults[i] = true
      } else {
        testResults[i] = false
      }
    }
    setTestResults(testResults)
  }, [detectedCurls, detectedDirections])

  return (
    <>
      <div className='flex flex-col items-center'>
        <div className='flex font-bold text-2xl uppercase space-x-2 items-center'>
          <p className="bg-primary p-2 rounded-md text-white font-bold">Try it out</p>
        </div>

        
        <div className='relative w-96 h-96 mt-4'>
          <HandposeCamera setDetectedCurls={setDetectedCurls} setDetectedDirections={setDetectedDirections} setActivated={setActivated} />
        </div>

        <div className={`grid grid-cols-5 w-96 mx-auto gap-2 transition-all ${activated ? "mt-8" : "mt-4"}`}>
          {fingerList.map((finger, idx) => (
            <div 
              key={idx} 
              className={`uppercase text-center border-2 border-primary rounded-md text-sm py-2 font-medium
              ${testResults[idx] ? "bg-primary text-white" : "bg-white"}`}>
                <p>{finger}</p>
            </div>
          ))}
        </div>
        
        <div className='flex'>
          <div>
            <p>Input Codes</p>
            <p>{curls}</p>
            <p>{directions}</p>
          </div>

          <div>
            <p>Camera Codes</p>
            <p>{detectedCurls}</p>
            <p>{detectedDirections}</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default HandposeTest