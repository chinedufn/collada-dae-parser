var createMatrix = require('gl-mat4/create')
var interpolate = require('mat4-interpolate')

var mat3FromMat4 = require('gl-mat3/from-mat4')
var quatMultiply = require('gl-quat/multiply')
var quatFromMat3 = require('gl-quat/fromMat3')
var vec4Scale = require('gl-vec4/scale')

// TODO: This should not be responsible for maintaining a clock
var animationClock = 0

module.exports = percentBetweenKeyframes

// Get the percent of time that has elapsed between two keyframes
//  based on the current clock time
// TODO: Rename this function. It no longer just returns elapsed time
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

  // We store our dual quaternion vectors and later push them to the GPU for duql quaternion blending
  var interpolatedRotQuaternions = []
  var interpolatedTransQuaternions = []

  // TODO: Just got dual quaternion skinning working! Code is a mess need to clean. Was throwing everything at the wall on this one..
  interpolatedJoints.forEach(function (joint, index) {
    joint = minJoints[index]
    var joint2 = maxJoints[index]
    var rotationMatrix = mat3FromMat4([], joint)
    var rotationQuat = quatFromMat3([], rotationMatrix)
    var transVec = [joint[12], joint[13], joint[14], 0]
    var transQuat = vec4Scale([], quatMultiply([], transVec, rotationQuat), 0.5)

    var rotationMatrix2 = mat3FromMat4([], joint2)
    var rotationQuat2 = quatFromMat3([], rotationMatrix2)
    var transVec2 = [joint2[12], joint2[13], joint2[14], 0]
    var transQuat2 = vec4Scale([], quatMultiply([], transVec2, rotationQuat2), 0.5)

    var vec4 = require('gl-quat')
    rotationQuat = require('gl-quat/add')([], vec4.scale([], rotationQuat, 1 - percentBetweenKeyframes), vec4.scale([], rotationQuat2, percentBetweenKeyframes))
    transQuat = require('gl-quat/add')([], vec4.scale([], transQuat, 1 - percentBetweenKeyframes), vec4.scale([], transQuat2, percentBetweenKeyframes))

    interpolatedRotQuaternions.push(rotationQuat)
    interpolatedTransQuaternions.push(transQuat)
  })

  return {
    interpolatedJoints: interpolatedJoints,
    interpolatedRotQuaternions: interpolatedRotQuaternions,
    interpolatedTransQuaternions: interpolatedTransQuaternions
  }
}
