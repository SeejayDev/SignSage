const fingerJoints = {
  thumb: [0,1,2,3,4],
  indexFinger: [0,5,6,7,8],
  middleFinger: [0,9,10,11,12],
  ringFinger: [0,13,14,15,16],
  pinky: [0,17,18,19,20]
}

const drawHandMesh = (predictions, ctx) => {
  if (predictions.length > 0) {
    predictions.forEach((prediction) => {
      const landmarks = prediction.keypoints
      //console.log(landmarks)

      for (let j = 0; j < Object.keys(fingerJoints).length; j++) {
        let finger = Object.keys(fingerJoints)[j]
        for (let k = 0; k < fingerJoints[finger].length - 1; k++) {
          const firstJointIndex = fingerJoints[finger][k]
          const secondJointIndex = fingerJoints[finger][k+1]

          ctx.beginPath()
          ctx.moveTo(landmarks[firstJointIndex].x, landmarks[firstJointIndex].y)
          ctx.lineTo(landmarks[secondJointIndex].x, landmarks[secondJointIndex].y)
          ctx.strokeStyle = "white"
          ctx.lineWidth = 4
          ctx.stroke()
        }
      }

      for (let i = 0; i < landmarks.length; i++) {
        const x = landmarks[i].x
        const y = landmarks[i].y

        ctx.beginPath()
        ctx.arc(x, y, 5, 0, 3 * Math.PI)

        ctx.fillStyle = '#24c6a9'
        ctx.fill()
      }
    })
  }
}

const Finger = {

  Thumb:  0,
  Index:  1,
  Middle: 2,
  Ring:   3,
  Pinky:  4,

  // just for convenience
  all: [0, 1, 2, 3, 4],

  nameMapping: {
    0: 'Thumb',
    1: 'Index',
    2: 'Middle',
    3: 'Ring',
    4: 'Pinky'
  },

  // Describes mapping of joints based on the 21 points returned by handpose.
  // Handpose indexes are defined as follows:
  // (all fingers use last index as "finger tip")
  // ---------------------------------------------------------------------------
  // [0]     Palm
  // [1-4]   Thumb
  // [5-8]   Index
  // [9-12]  Middle
  // [13-16] Ring
  // [17-20] Pinky
  pointsMapping: {
    0: [[0, 1], [1, 2], [2, 3], [3, 4]],
    1: [[0, 5], [5, 6], [6, 7], [7, 8]],
    2: [[0, 9], [9, 10], [10, 11], [11, 12]],
    3: [[0, 13], [13, 14], [14, 15], [15, 16]],
    4: [[0, 17], [17, 18], [18, 19], [19, 20]]
  },

  getName: function(value) {
    return (typeof this.nameMapping[value] !== undefined) ?
      this.nameMapping[value] : false;
  },

  getPoints: function(value) {
    return (typeof this.pointsMapping[value] !== undefined) ?
      this.pointsMapping[value] : false;
  },
}

const FingerCurl = {

  NoCurl: 0,
  HalfCurl: 1,
  FullCurl: 2,

  nameMapping: {
    0: 'No Curl',
    1: 'Half Curl',
    2: 'Full Curl'
  },

  getName: function(value) {
    return (typeof this.nameMapping[value] !== undefined) ?
      this.nameMapping[value] : false;
  },

};

const FingerDirection = {

  VerticalUp: 0,
  VerticalDown: 1,
  HorizontalLeft: 2,
  HorizontalRight: 3,
  DiagonalUpRight: 4,
  DiagonalUpLeft: 5,
  DiagonalDownRight: 6,
  DiagonalDownLeft: 7,

  nameMapping: {
    0: 'Vertical Up',
    1: 'Vertical Down',
    2: 'Horizontal Left',
    3: 'Horizontal Right',
    4: 'Diagonal Up Right',
    5: 'Diagonal Up Left',
    6: 'Diagonal Down Right',
    7: 'Diagonal Down Left',
  },

  getName: function(value) {
    return (typeof this.nameMapping[value] !== undefined) ?
      this.nameMapping[value] : false;
  },
};

export {Finger, FingerCurl, FingerDirection, drawHandMesh }