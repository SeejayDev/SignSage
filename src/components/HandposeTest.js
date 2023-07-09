import React, { useEffect, useRef, useState } from 'react'
import Webcam from 'react-webcam'
import { Camera } from 'src/icons/Camera'
import * as handPoseDetection from '@tensorflow-models/hand-pose-detection';
import FingerPoseEstimator from 'src/posedetection/FingerPoseEstimator';
import { drawHandMesh } from 'src/posedetection/FingerposeFunctions';
import { Plus } from 'src/icons/Plus';

const HandposeTest = (props) => {
  const { curls = [0,0,0,0,0], directions = [0,0,0,0,0], sways = [0,0,0,0,0] } = props
  const [activated, setActivated] = useState(false)
  const [detectedCurls, setDetectedCurls] = useState([])
  const [detectedDirections, setDetectedDirections] = useState([])
  const [testResults, setTestResults] = useState([false, false, true, false, false])
  const webcamRef = useRef(null)
  const canvasRef = useRef(null)
  const fingerList = ["thumb", "index", "middle", "ring", "pinky"]

  // function to perform the detection
  const runDetection = async () => {
    const estimator = new FingerPoseEstimator()
    
    const model = handPoseDetection.SupportedModels.MediaPipeHands;
    const detectorConfig = {
      runtime: 'mediapipe',
      modelType: 'full',
      solutionPath: '/model'
    };
    var detector = await handPoseDetection.createDetector(model, detectorConfig);
    
    setInterval(()=> {
      detect(detector, estimator)
    }, 50)
  }

  // function to get values from webcam
  const detect = async (model, estimator) => {
    if (typeof webcamRef.current !== "undefined" && webcamRef.current !== null && webcamRef.current.video.readyState === 4) {
      // Get video properties
      const video = webcamRef.current.video
      const videoWidth = video.videoWidth
      const videoHeight = video.videoHeight

      // Set video width and height
      webcamRef.current.video.width = videoWidth
      webcamRef.current.video.height = videoHeight

      // Set canvas width and height
      canvasRef.current.width = videoWidth
      canvasRef.current.height = videoHeight
  
      // Make detections
      const detections = await model.estimateHands(video, true)
      if (detections?.length !== 0) {
        //console.log(detections)
        const keypoints = detections[0].keypoints3D
        var landmarks = []
        for (let i = 0; i < keypoints.length; i++) {
          let landmark = []
          landmark.push(keypoints[i].x)
          landmark.push(keypoints[i].y)
          landmark.push(keypoints[i].z)
          landmarks.push(landmark)
        }

        const est = estimator.estimate(landmarks);
        setDetectedCurls(est.curls)
        setDetectedDirections(est.directions)

        // Draw mesh 
        const ctx = canvasRef.current.getContext("2d")
        drawHandMesh(detections, ctx)
      }
    }
  }

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

  useEffect(()=> {
    runDetection()
  }, [])

  return (
    <>
      <div className='flex flex-col items-center'>
        <div className='flex font-bold text-2xl uppercase space-x-2 items-center'>
          <p className="bg-primary p-2 rounded-md text-white font-bold">Try it out</p>
        </div>

        <div className='relative w-96 h-96 mt-4'>
          <div className='bg-black w-full h-full rounded-md relative z-20 shadow-md overflow-hidden'>
            {activated && 
              <div className='w-full h-full absolute top-0 left-0'>
                <Webcam 
                  ref={webcamRef}
                  className='absolute mx-auto left-0 right-0 text-center z-10 w-full h-full object-cover'
                  mirrored={true}
                />

                <label htmlFor='camBtn' className='absolute right-4 top-4 z-30 bg-white rounded-full p-1 cursor-pointer'>
                  <Plus className="w-6 h-6 rotate-45 text-primary" />
                </label>

                <canvas
                  ref={canvasRef}
                  style={{
                    transform: "scaleX(-1.3)"
                  }}
                  className='absolute mx-auto left-0 right-0 text-center z-20 w-full h-full' 
                  />
              </div>
            }

            <div className='w-full h-full flex flex-col items-center justify-center text-white'>
              <p className=''>Turn camera on:</p>
              <button id='camBtn' className='bg-white rounded-lg p-3 text-primary mt-2' onClick={()=>setActivated(!activated)}>
                <Camera className="w-8 h-8" />
              </button>
            </div>
          </div>
          <div className={`bg-primary rounded-md absolute w-full h-full top-0 left-0 transition-transform z-10 shadow-md ${activated && "transform translate-x-4 translate-y-4"}`}></div>
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