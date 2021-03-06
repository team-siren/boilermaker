/* eslint-disable max-params */
/* eslint-disable complexity */
/* eslint-disable max-statements */

// created from PoseNet keypoint map to access certain user body parts
// ex. check if user is in frame, create hand location windows/activate remove game items, spawn items in proportion to user body, etc.
export const bodyPointLocations = {
  nose: 0,
  leftEye: 1,
  rightEye: 2,
  leftEar: 3,
  rightEar: 4,
  leftShoulder: 5,
  rightShoulder: 6,
  leftElbow: 7,
  rightElbow: 8,
  leftWrist: 9,
  rightWrist: 10,
  leftHip: 11,
  rightHip: 12,
  leftKnee: 13,
  rightKnee: 14,
  leftAnkle: 15,
  rightAnkle: 16
}
// ease of use => bodyPointLocations[bodyPart] = idxPositionInKeypointsArr

// body part coordinates helper function
export function findPoint(bodyPart, keypoints) {
  const bodyPartIndex = bodyPointLocations[bodyPart]
  const bodyPartPosition = keypoints[bodyPartIndex].position

  return {x: bodyPartPosition.x, y: bodyPartPosition.y}
}

//FUNCTION TO PRODUCE VARIABLES FOR THE CAMERA.JS RENDER
import React from 'react'
import GameInit from '../components/GameInit'

export const variablesForCameraRender = loadingStatus => {
  const loading = loadingStatus ? (
    <img className="loading" src="/assets/loading.gif" />
  ) : null

  const gameInit = loadingStatus ? null : <GameInit loading={loadingStatus} />

  return {
    loading,
    gameInit
  }
}

// spawn coordinates for game items
import store from '../store'
export function generateRandomCoords(gameItem) {
  let state = store.getState()
  const keypoints = state.keypoints

  // find coordinates of user's shoulders
  const rightShoulderCoords = findPoint('rightShoulder', keypoints)
  const leftShoulderCoords = findPoint('leftShoulder', keypoints)

  // set range to entire window
  let xCoordRange = Math.random() * (window.innerWidth - 150)
  const yCoordRange = Math.random() * (window.innerHeight - 150)

  // do not spawn within user's body (based off of shoulder coords)
  const forbiddenXRange =
    leftShoulderCoords.x + 50 - (rightShoulderCoords.x - 50)
  // if x coordinate lands within forbidden range
  let spawnOnRightSide = true
  if (
    xCoordRange > rightShoulderCoords.x - 150 &&
    xCoordRange < leftShoulderCoords.x
  ) {
    if (spawnOnRightSide) {
      xCoordRange += forbiddenXRange
      // prevents x coord from setting outside window
      if (xCoordRange > window.innderWidth - 150)
        xCoordRange = window.innerWidth - 150
    } else if (!spawnOnRightSide) {
      xCoordRange -= forbiddenXRange
      if (xCoordRange < 0) xCoordRange = 0
    }

    // alternate sides to spawn
    spawnOnRightSide = !spawnOnRightSide
  }

  gameItem.x = xCoordRange
  gameItem.y = yCoordRange

  return {
    x: gameItem.x,
    y: gameItem.y
  }
}

export function calculateItemLocation(keypoints, gameItem) {
  const itemWidth = gameItem.width
  //find wrist coords and hand coords
  const rightWristCoords = findPoint('rightWrist', keypoints)
  const leftWristCoords = findPoint('leftWrist', keypoints)
  const rightElbowCoords = findPoint('rightElbow', keypoints)
  const leftElbowCoords = findPoint('leftElbow', keypoints)

  //item coords correspond to upper left corner of image
  let itemCoords = {
    x: gameItem.x,
    y: gameItem.y
  }

  // item location window
  //item radius is distance from corner of item to center
  //assumes that items are squares thus the diagonal is x√2 so radius is half
  const itemRadius = itemWidth * Math.sqrt(2) / 2
  //corner of item to center in square is 45 degree angle( pi/4). cos of angle times radius(hypotenuse) gives x distance from corner to center
  //add corner x coord to get x coord of item center
  const itemCenterX = Math.cos(Math.PI / 4) * itemRadius + itemCoords.x
  //sin of angle times radius(hypotenuse) gives y distance from corner to center. In screen coordinate system y increases as you go down the page
  //therefore use positive pi/4 for angle instead of negative.
  const itemCenterY = Math.sin(Math.PI / 4) * itemRadius + itemCoords.y

  //CREATE RIGHT HAND POINT BASED ON ANGLE BETWEEN RIGHT ELBOW AND RIGHT WRIST
  //distance between wrist and elbow
  const yDiffR = rightWristCoords.y - rightElbowCoords.y
  const xDiffR = rightWristCoords.x - rightElbowCoords.x

  //angle between wrist and elbow
  //correct angle for arm down and to your right
  let angleR = Math.atan(Math.abs(yDiffR) / Math.abs(xDiffR))

  //correct angle for arm down and to your left
  if (yDiffR >= 0 && xDiffR <= 0) angleR = Math.PI - angleR
  //correct angle for arm up and to your left
  if (yDiffR < 0 && xDiffR <= 0) angleR = angleR + Math.PI
  //correct angle for arm up and to your right
  if (yDiffR < 0 && xDiffR > 0) angleR = 2 * Math.PI - angleR

  //y distance from wrist point to new "hand point", 50 pixels is hypoteneus or radius of imaginary circle
  let yDistanceR = Math.sin(angleR) * 50
  //x distance from wrist point to new "hand point", 50 pixels is hypoteneus or radius of imaginary circle
  let xDistanceR = Math.cos(angleR) * 50
  //created a point in middle of hand
  let rightHandCoordY = yDistanceR + rightWristCoords.y
  let rightHandCoordX = xDistanceR + rightWristCoords.x

  //distance between new hand point and center of item
  let handToItemDistanceR = Math.sqrt(
    Math.pow(rightHandCoordX - itemCenterX, 2) +
      Math.pow(rightHandCoordY - itemCenterY, 2)
  )

  //CREATE LEFT HAND POINT BASED ON ANGLE BETWEEN LEFT ELBOW AND LEFT WRIST
  //distance between wrist and elbow
  const yDiffL = leftWristCoords.y - leftElbowCoords.y
  const xDiffL = leftWristCoords.x - leftElbowCoords.x

  //angle between wrist and elbow
  //correct angle for arm down and to your right
  let angleL = Math.atan(Math.abs(yDiffL) / Math.abs(xDiffL))
  //correct angle for arm down and to your left
  if (yDiffL >= 0 && xDiffL <= 0) angleL = Math.PI - angleL
  //correct angle for arm up and to your left
  if (yDiffL < 0 && xDiffL <= 0) angleL = angleL + Math.PI
  //correct angle for arm up and to your right
  if (yDiffL < 0 && xDiffL > 0) angleL = 2 * Math.PI - angleL

  //y distance from wrist point to new "hand point", 50 pixels is hypoteneus or radius of imaginary circle
  let yDistanceL = Math.sin(angleL) * 50
  //x distance from wrist point to new "hand point", 50 pixels is hypoteneus or radius of imaginary circle
  let xDistanceL = Math.cos(angleL) * 50
  //created a point in middle of hand
  let leftHandCoordY = yDistanceL + leftWristCoords.y
  let leftHandCoordX = xDistanceL + leftWristCoords.x

  //distance between new hand point and center of item
  let handToItemDistanceL = Math.sqrt(
    Math.pow(leftHandCoordX - itemCenterX, 2) +
      Math.pow(leftHandCoordY - itemCenterY, 2)
  )

  return {
    itemRadius,
    handToItemDistanceL,
    handToItemDistanceR
  }
}

// shuffles riskyGameItems so bombs aren't added right after each other on level increase
export function shuffle(array) {
  const newArray = array.slice()
  let currentIndex = newArray.length
  let tempValue
  let randomIndex

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex -= 1

    tempValue = newArray[currentIndex]
    newArray[currentIndex] = newArray[randomIndex]
    newArray[randomIndex] = tempValue
  }

  return newArray
}

// when a user's body point enters item location window range
export function hitSequence(gameItem, sound, explodeFunc, removeFunc) {
  if (gameItem.type !== 'bomb') {
    explodeFunc(gameItem)
    sound.play()
    let toRemove = gameItem
    setTimeout(() => {
      removeFunc(toRemove)
    }, 260)
  }
}

// Game 1 & 2
export function finishGame(
  music,
  stopTimerFunc,
  winSound,
  gameItemsArray,
  explodeFunc,
  squish
) {
  music.pause()
  stopTimerFunc()
  winSound.play()
  for (let i = 0; i < gameItemsArray.length; i++) explodeFunc(gameItemsArray[i])
  squish.play()
  squish.play()
}

import {Link} from 'react-router-dom'
export const pauseMenuDiv = (
  gamePauseStatus,
  togglePause,
  hoverSound,
  buttonSound
) => {
  return gamePauseStatus ? (
    <div id="pauseScreen" className="center">
      <img className="pausedText" src="/assets/PAUSED.png" />
      <img
        className="continueButton"
        src="/assets/buttons/continueButton.png"
        onMouseEnter={() => hoverSound.play()}
        onClick={togglePause}
      />
      <Link to="/select">
        <img
          className="homeButton"
          src="/assets/buttons/returnToGameSelectButton.png"
          onMouseEnter={() => hoverSound.play()}
          onClick={() => {
            buttonSound.play()
          }}
        />
      </Link>
    </div>
  ) : null
}
