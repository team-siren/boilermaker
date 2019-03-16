import React, {Component} from 'react'
import {connect} from 'react-redux'
import {bodyPointLocations} from './utils'

class GameInit extends Component {
  constructor(props) {
    super(props)
    this.state = {
      localInitialBody: {}
    }
  }

  componentDidMount() {
    const localInitialBody = this.props.initialBody
    this.setState({localInitialBody})
  }

  calculateProportions(pose) {
    const keypoints = this.state.localInitialBody.keypoints
  }
}

const mapStateToProps = state => {
  return {
    initialBody: state.initialBody
  }
}

export default connect(mapStateToProps)(GameInit)
