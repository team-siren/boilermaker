import React from 'react'
import {Link} from 'react-router-dom'

const NoMatch = () => {
  const buttonSound = new Audio('/assets/buttonPress.mp3')
  const hoverSound = new Audio('/assets/buttonHover.mp3')

  return (
    <div className="center" id="noMatch">
      <iframe
        src="/assets/silence.mp3"
        allow="autoplay"
        style={{display: 'none'}}
        id="iframeAudio"
      />
      <audio loop="loop" autoPlay="autoplay">
        <source src="/assets/LazyAfternoons.mp3" type="audio/mpeg" />
      </audio>
      <img src="/assets/404.gif" />

      <h3>Dead link!</h3>
      <Link to="/">
        <img
          src="/assets/homeButton.png"
          className="homeButton"
          onMouseOver={() => hoverSound.play()}
          onClick={() => buttonSound.play()}
        />
      </Link>
    </div>
  )
}

export default NoMatch
