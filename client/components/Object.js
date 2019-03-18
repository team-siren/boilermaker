import React, {Component} from 'react'

class Object extends Component {
  constructor(props) {
    super(props)
    this.state = {
      imageUrl:
        props.imageUrl ||
        'https://pbs.twimg.com/profile_images/846659478120366082/K-kZVvT8_400x400.jpg',
      x: 50,
      y: 400,
      width: 100
    } //upper left hand corner is the actual coordinates
  }
  //https://i.gifer.com/5DYJ.gif

  componentDidMount() {
    this.setState({
      x: this.props.x,
      y: this.props.y,
      width: this.props.width
    })
  }

  componentDidUpdate(prevProps) {
    if (prevProps.imageUrl !== this.props.imageUrl) {
      this.setState({
        ...this.state,
        imageUrl: this.props.imageUrl
      })
    }
  }

  render() {
    return (
      <div>
        <img
          src={this.state.imageUrl}
          width={this.state.width}
          height="100px"
          style={{
            position: 'fixed',
            top: this.state.y,
            left: this.state.x
          }}
          className="gameObject"
        />
      </div>
    )
  }
}

export default Object
