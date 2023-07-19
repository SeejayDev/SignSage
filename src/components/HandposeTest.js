import React, { useEffect, useRef, useState } from 'react'
import HandposeCamera from './HandposeCamera';
import { curlOptions, directionOptions, fingerList } from 'src/posedetection/FingerposeValues';
import { Notification } from 'src/icons/Notification';

const HandposeTest = (props) => {
  const { curls = [0,0,0,0,0], directions = [0,0,0,0,0], sways = [0,0,0,0,0], setStepsMatched = ()=>{} } = props
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
    let completedSteps = 0
    for (let i = 0; i < 5; i++) {
      // determine if the direction of the finger matches
      let directionMatch = false
      if (sways[i] === 1) {
        // check if the direction matches any of the sway directions
        directionMatch = checkDirectionWithSway(directions[i], detectedDirections[i])
      } else {
        // if sway is not allowed, directly compare the directions
        directionMatch = directions[i] === detectedDirections[i]
      }

      // determine if the curl of the finger matches
      let curlMatch = detectedCurls[i] === curls[i]

      // if both curl and direction match:
      if (directionMatch && curlMatch) {
        // mark the finger result as true
        testResults[i] = true

        // add 2 to the completed steps count
        completedSteps += 2
      } else {
        // if either the curl or direction do not match:
        // mark the finger result as false
        testResults[i] = false

        // check if the student got either the direction or curl correct
        if (directionMatch) {completedSteps += 1}
        if (curlMatch) {completedSteps += 1}
        
        // check if the clue variable has already been set before
        if (clue === "" && cameraActive) {
          // check which aspect did not match, and set the instruction variable
          if (!curlMatch) {
            clue = `The ${fingerList[i]} should be ${curlOptions[curls[i]]}`
          } else if (!directionMatch) {
            clue = `The ${fingerList[i]} should point ${directionOptions[directions[i]].orientation}`
            
            // some directions do not have the "to the left/right" value
            if (directionOptions[directions[i].direction !== null]) {
              clue += `to the ${directionOptions[directions[i]].direction}`
            }
          }
        }
      }
    }

    // update the page with the detection results
    setStepsMatched(completedSteps)
    setInstruction(clue)
    setTestResults(testResults)
  }, [detectedCurls, detectedDirections])

  return (
    <>
      <div className='flex flex-col items-center'>
        <div className='flex font-bold text-2xl uppercase space-x-2 items-center'>
          <p className="bg-primary p-2 rounded-md text-white font-bold">Try it out</p>
        </div>

        
        <div className='relative w-full aspect-square mt-4'>
          <HandposeCamera 
            setDetectedCurls={setDetectedCurls} 
            setDetectedDirections={setDetectedDirections} 
            setActivated={setCameraActive} />
        </div>

        <div className={`grid grid-cols-5 w-full mx-auto gap-2 transition-all ${cameraActive ? "mt-8" : "mt-4"}`}>
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
          <div className='p-2 rounded-md bg-red-400 text-white w-full font-medium flex items-center mt-4'>
            <Notification className="w-5 h-5 mr-2" />
            <p className=''>{instruction}</p>
          </div>
        }
      </div>
    </>
  )
}

export default HandposeTest