import React, { useEffect, useRef, useState } from 'react'
import Webcam from 'react-webcam'
import { Plus } from 'src/icons/Plus'
import * as handPoseDetection from '@tensorflow-models/hand-pose-detection';
import FingerPoseEstimator from 'src/posedetection/FingerPoseEstimator';
import { drawHandMesh } from 'src/posedetection/FingerposeFunctions';
import { Camera } from 'src/icons/Camera';

const HandposeCamera = (props) => {
  const blankFunction = () => {}
  const { setDetectedCurls = blankFunction, setDetectedDirections=blankFunction, setActivated=blankFunction } = props

  const webcamRef = useRef(null)
  const canvasRef = useRef(null)
  const [active, setActive] = useState(false)

  const toggleActive = (value) => {
    setActive(value)
    setActivated(value)
  }

  // function to initiate the detection models
  const runDetection = async () => {
    // create a new instance of the class used to convert landmarks into directions/curls
    const estimator = new FingerPoseEstimator()
    
    // load the detection model from TensorFlow.js
    const model = handPoseDetection.SupportedModels.MediaPipeHands;
    const detectorConfig = {
      runtime: 'mediapipe',
      modelType: 'full',
      solutionPath: '/model'
    };

    // create an instance of the model with the configuration set
    var detector = await handPoseDetection.createDetector(model, detectorConfig);
    
    // begin running the detection 10 times every second 
    setInterval(()=> {
      detect(detector, estimator)
    }, 100)
  }

  // function to get values from webcam
  const detect = async (model, estimator) => {
    if (typeof webcamRef.current !== "undefined" && webcamRef.current !== null && webcamRef.current.video.readyState === 4) {
      // Get video properties
      const video = webcamRef.current.video
      const videoWidth = video.videoWidth
      const videoHeight = video.videoHeight

      // Set video and canvas width and height
      webcamRef.current.video.width = videoWidth
      webcamRef.current.video.height = videoHeight
      canvasRef.current.width = videoWidth
      canvasRef.current.height = videoHeight
  
      // Make detections
      const detections = await model.estimateHands(video)
      
      // Check if any hands were detected
      if (detections?.length !== 0) {
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

  useEffect(()=> {
    runDetection()
  }, [])

  return (
    <div className='w-full h-full relative'>
      <div className='bg-black w-full h-full rounded-md relative z-20 shadow-md overflow-hidden'>
            {active && 
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
              <button id='camBtn' className='bg-white rounded-lg p-3 text-primary mt-2' onClick={()=>toggleActive(!active)}>
                <Camera className="w-8 h-8" />
              </button>
            </div>
          </div>
          <div className={`bg-primary rounded-md absolute w-full h-full top-0 left-0 transition-transform z-10 shadow-md ${active && "transform translate-x-4 translate-y-4"}`}></div>
    </div>
  )
}

export default HandposeCamera