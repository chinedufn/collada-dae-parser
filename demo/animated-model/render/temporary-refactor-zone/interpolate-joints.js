var createMatrix = require('gl-mat4/create')
var interpolate = require('mat4-interpolate')

// TODO: This should not be responsible for maintaining a clock
var animationClock = 0

module.exports = percentBetweenKeyframes

// Get the percent of time that has elapsed between two keyframes
//  based on the current clock time
function percentBetweenKeyframes (keyframes, dt, numJoints) {
  var min
  var max
  Object.keys(keyframes).forEach(function (frame) {
    if (!min && !max) {
      min = frame
      max = frame
    } else {
      min = Math.min(min, frame)
      max = Math.max(max, frame)
    }
  })
  animationClock += dt / 1000
  var animationDuration = max - min
  if (animationClock > animationDuration) {
    animationClock %= animationDuration
  }
  // Find two closest keyframes
  var lowestKeyframe = null
  min = max = null
  var minJoints = []
  var maxJoints = []
  Object.keys(keyframes).sort().forEach(function (frame, index) {
    frame = Number(frame)
    if (index === 0) { lowestKeyframe = frame }
    if (frame <= lowestKeyframe + animationClock) {
      min = frame
      minJoints = keyframes['' + frame]
    }
    if (frame >= lowestKeyframe + animationClock && !max) {
      max = frame
      maxJoints = keyframes['' + frame]
    }
  })

  var percentBetweenKeyframes = (lowestKeyframe + animationClock - min) / (max - min)

  var interpolatedJoints = []
  for (var i = 0; i < numJoints; i++) {
    interpolatedJoints[i] = createMatrix()
    interpolate(interpolatedJoints[i], minJoints[i] || createMatrix(), maxJoints[i] || createMatrix(), percentBetweenKeyframes)
  }

  return interpolatedJoints
}

