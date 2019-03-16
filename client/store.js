//initial state
const initialState = {
  keypoints: [],
  initialBody: []
}

//action types
const GOT_KEYPOINTS = 'GOT_KEYPOINTS'
const GOT_INITIALBODY = 'GOT_INITIALBODY'

//action creators
export const gotKeypoints = keypoints => {
  return {
    type: GOT_KEYPOINTS,
    keypoints
  }
}

export const recordInitialBody = pose => {
  return {
    type: GOT_INITIALBODY,
    pose
  }
}

//reducer
const keyPointsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GOT_KEYPOINTS:
      return {
        ...state,
        keypoints: action.keypoints
      }
    case GOT_INITIALBODY:
      return {
        ...state,
        initialBody: action.pose
      }
    default:
      return state
  }
}

export default keyPointsReducer
