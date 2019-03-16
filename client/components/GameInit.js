import React, {Component} from 'react'
import {connect} from 'react-redux'
import {bodyPointLocations} from './utils'
import {gotProportions} from '../store'

class GameInit extends Component {
  constructor(props) {
    super(props)
    this.state = {
      count: 10,
      timerRunning: false
      // localInitialBody: [], //<--leave these commented out
      // localProportions: {}  //<--they're just a reminder of state structure
    }
  }

  componentDidMount() {
    console.log('mounted')
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !!this.props.initialBody.score
  } /* equivalent to the ternary:
  `return this.props.initialBody.score ? false : true`
  meaning: if the initialBody in the global store has a score (and thus keypoints) property, no need to update
  */

  componentDidUpdate() {
    if (!this.state.localInitialBody) {
      //if there's no localInitialBody yet
      this.setState({
        //load the global intialBody to the local state
        localInitialBody: this.props.initialBody
      })
      this.calculateProportions() //and calculate its proportions
    }
  }

  calculateProportions(pose) {
    const initialKeypoints = this.props.initialBody.keypoints
    this.setState({localInitialBody: initialKeypoints})
    //make the local initial body the keypoints array of the intial pose

    const findCoords = bodyPart => {
      let coords
      if (initialKeypoints[bodyPointLocations[bodyPart]]) {
        //e.g., find whatever is at the keypoint index indicated by the the index of the bodyPart given in the official utility list
        coords = initialKeypoints[bodyPointLocations[bodyPart]].position
      } //else coords = {x: 0, y: 0}
      return coords
    }

    const leftEyeCoords = findCoords('leftEye')
    const leftShoulderCoords = findCoords('leftShoulder')
    const leftElbowCoords = findCoords('leftElbow')
    const leftWristCoords = findCoords('leftWrist')
    const leftHipCoords = findCoords('leftHip')
    const leftKneeCoords = findCoords('leftKnee')
    const leftAnkleCoords = findCoords('leftAnkle')

    const distanceBetween = (p1, p2) => Math.abs(p1 - p2)

    //`D = √ dx^2 + dy2`, or:
    //the distance between two x,y points is the square root of the difference between the two x coords of the points, cubed, plus the difference between the two y coords of the points, cubed. --https://www.mathopenref.com/coorddist.html

    const height =
      //eye to ankle
      Math.sqrt(
        distanceBetween(leftEyeCoords.x, leftAnkleCoords.x) *
          distanceBetween(leftEyeCoords.x, leftAnkleCoords.x) +
          distanceBetween(leftEyeCoords.y, leftAnkleCoords.y) *
            distanceBetween(leftEyeCoords.y, leftAnkleCoords.y)
      )

    const armLength =
      //shoulder to elbow
      Math.sqrt(
        distanceBetween(leftShoulderCoords.x, leftShoulderCoords.x) *
          distanceBetween(leftShoulderCoords.x, leftShoulderCoords.x) +
          distanceBetween(leftElbowCoords.y, leftElbowCoords.y) *
            distanceBetween(leftElbowCoords.y, leftElbowCoords.y)
      ) +
      //+ elbow to wrist
      Math.sqrt(
        distanceBetween(leftElbowCoords.x, leftElbowCoords.x) *
          distanceBetween(leftElbowCoords.x, leftElbowCoords.x) +
          distanceBetween(leftWristCoords.y, leftWristCoords.y) *
            distanceBetween(leftWristCoords.y, leftWristCoords.y)
      )

    const legLength =
      //hip to knee
      Math.sqrt(
        distanceBetween(leftHipCoords.x, leftHipCoords.x) *
          distanceBetween(leftHipCoords.x, leftHipCoords.x) +
          distanceBetween(leftKneeCoords.y, leftKneeCoords.y) *
            distanceBetween(leftKneeCoords.y, leftKneeCoords.y)
      ) +
      //+ knee to ankle
      Math.sqrt(
        distanceBetween(leftKneeCoords.x, leftKneeCoords.x) *
          distanceBetween(leftKneeCoords.x, leftKneeCoords.x) +
          distanceBetween(leftAnkleCoords.y, leftAnkleCoords.y) *
            distanceBetween(leftAnkleCoords.y, leftAnkleCoords.y)
      )

    const proportions = {
      height,
      armLength,
      legLength
    }

    if (!this.state.localProportions) {
      //if no local proportions were recorded yet
      this.setState({
        ...this.state,
        localProportions: proportions //save them to the local state...
      })
    }

    //and send them to the global state via dispatch:
    this.props.getProportions(proportions)
  }

  render() {
    return <h1>'bla'</h1>
  }
}

const mapStateToProps = state => {
  return {
    initialBody: state.initialBody,
    proportionsOnState: state.proportions,
    state: state
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getProportions: proportions => {
      dispatch(gotProportions(proportions))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GameInit)
