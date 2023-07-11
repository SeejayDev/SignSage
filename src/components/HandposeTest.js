import React, { useEffect, useRef, useState } from 'react'
import Webcam from 'react-webcam'
import { Camera } from 'src/icons/Camera'
import { Plus } from 'src/icons/Plus';
import HandposeCamera from './HandposeCamera';
import { curlOptions, directionOptions, fingerList } from 'src/posedetection/FingerposeValues';
import { Notification } from 'src/icons/Notification';

const HandposeTest = (props) => {
  const { curls = [0,0,0,0,0], directions = [0,0,0,0,0], sways = [0,0,0,0,0] } = props
  const [cameraActive, setCameraActive] = useState(false)
  const [detectedCurls, setDetectedCurls] = useState([])
  const [instruction, setInstruction] = useState("")
  const [detectedDirections, setDetectedDirections] = useState([])
  const [testResults, setTestResults] = useState([false, false, true, false, false])
  const fingers = ["thumb", "index", "middle", "ring", "pinky"]

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
    let clue = ""
    for (let i = 0; i < 5; i++) {
      if (checkDirectionWithSway(directions[i], detectedDirections[i]) && detectedCurls[i] === curls[i]) {
        testResults[i] = true
      } else {
        testResults[i] = false

        if (clue === "" && cameraActive) {
          if (detectedCurls[i] !== curls[i]) {
            clue = `The ${fingerList[i]} should be ${curlOptions[curls[i]]}`
          } else if (detectedDirections[i] !== directions[i]) {
            clue = `The ${fingerList[i]} should point ${directionOptions[directions[i]].orientation} 
              ${directionOptions[directions[i]].direction && `to the ${directionOptions[directions[i]].direction}`}`
          }
        }
      }
    }
    setInstruction(clue)
    setTestResults(testResults)
  }, [detectedCurls, detectedDirections])

  return (
    <>
      <div className='flex flex-col items-center'>
        <div className='flex font-bold text-2xl uppercase space-x-2 items-center'>
          <p className="bg-primary p-2 rounded-md text-white font-bold">Try it out</p>
        </div>

        
        <div className='relative w-72 h-72 2xl:w-96 2xl:h-96 mt-4'>
          <HandposeCamera setDetectedCurls={setDetectedCurls} setDetectedDirections={setDetectedDirections} setActivated={setCameraActive} />
        </div>

        <div className={`grid grid-cols-5 w-96 mx-auto gap-2 transition-all ${cameraActive ? "mt-8" : "mt-4"}`}>
          {fingers.map((finger, idx) => (
            <div 
              key={idx} 
              className={`uppercase text-center border-2 border-primary rounded-md text-sm py-2 font-medium
              ${testResults[idx] ? "bg-primary text-white" : "bg-white"}`}>
                <p>{finger}</p>
            </div>
          ))}
        </div>
        
        {instruction !== "" &&
          <div className='p-2 rounded-md bg-red-400 text-white w-96 font-medium flex items-center mt-4'>
            <Notification className="w-5 h-5 mr-2" />
            <p className=''>{instruction}</p>
          </div>
        }
        
        {/* <div className='mt-4 space-y-2'>
          {testResults.map((result, idx) => {
            if (!result) {
              return (
                <>
                  {detectedCurls[idx] !== curls[idx] &&
                    <div className='p-2 rounded-md bg-red-400 text-white w-96 font-medium flex items-center'>
                      <Notification className="w-5 h-5 mr-2" />
                      <p className=''>The {fingerList[idx]} should be {curlOptions[curls[idx]]}</p>
                    </div>
                  }
                  {detectedDirections[idx] !== directions[idx] &&
                    <div className='p-2 rounded-md bg-red-400 text-white w-96 font-medium flex items-center'>
                      <Notification className="w-6 h-6 mr-2" />
                      <p className=''>The {fingerList[idx]} should point {directionOptions[directions[idx]].orientation} {directionOptions[directions[idx]].direction && `to the ${directionOptions[directions[idx]].direction}`}</p>
                    </div>
                  }
                </>
              )
            }
          })}
        </div> */}
        
        {/* <div className='flex'>
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
        </div> */}
      </div>
    </>
  )
}

export default HandposeTest