import React, {Component} from 'react'
import {connect} from 'react-redux'
import {bodyPointLocations} from './utils'
import {gotProportions} from '../store'

class GameInit extends Component {
  constructor(props) {
    super(props)
    this.state = {
      localInitialBody: []
    }
  }

  componentDidMount() {
    console.log('mounted')
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !!this.props.initialBody.score
  }

  componentDidUpdate() {
    if (
      Array.isArray(this.state.localInitialBody) &&
      this.state.localInitialBody.length
    ) {
      this.setState({
        localInitialBody: this.props.initialBody
      })
      this.calculateProportions()
    }
  }

  calculateProportions(pose) {
    const initialKeypoints = this.props.initialBody.keypoints
    console.log('initial keypoints iside calculate: ', initialKeypoints)
    this.setState({localInitialBody: initialKeypoints})
    console.log('LIB inside calculate proportions', this.state.localInitialBody)

    const leftEyeCoords = findCoords('leftEye')
    const leftShoulderCoords = findCoords('leftShoulder')
    const leftElbowCoords = findCoords('leftElbow')
    const leftWristCoords = findCoords('leftWrist')
    const leftHipCoords = findCoords('leftHip')
    const leftKneeCoords = findCoords('leftKnee')
    const leftAnkleCoords = findCoords('leftAnkle')

    const distanceBetween = (p1, p2) => Math.abs(p1 - p2)

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

    this.props.getProportions(proportions)
  }

  findCoords(bodyPart) {
    const keypoints = this.state.localInitialBody
    const coords = keypoints[bodyPointLocations[bodyPart]].position
    return coords
  }

  render() {
    console.log('PROPORTIONS ON STATE: ', this.props.proportionsOnState)
    console.log('STATE', this.props.state)

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
