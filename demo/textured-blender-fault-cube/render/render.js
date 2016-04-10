var matrixMultiply = require('./matrix-math/multiply.js')
var makeTranslation = require('./matrix-math/make-translation.js')
var makePerspective = require('./matrix-math/make-perspective.js')
// var makeYRotation = require('./matrix-math/make-y-rotation.js')
// var makeXRotation = require('./matrix-math/make-x-rotation.js')
var makeLookAt = require('./matrix-math/make-look-at.js')
var makeInverse = require('./matrix-math/make-inverse.js')
var interpolate = require('mat4-interpolate')
var createMatrix = require('gl-mat4/create')

var animationClock = 0

module.exports = Render

// TODO: Pass in an object instead of a bunch of params
// TODO: There's a lot happening in here that should happen elsewhere (i.e. animation setup)
// will be easier to split out once we know what we're doing
function Render (gl, viewport, animatedModel, shaderObject, dt) {
  var min
  var max
  Object.keys(animatedModel.keyframes).forEach(function (frame) {
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
    animationClock -= animationDuration
  }
  // Find two closest keyframes
  var lowestKeyframe = null
  min = max = null
  var minJoints
  var maxJoints
  Object.keys(animatedModel.keyframes).forEach(function (frame, index) {
    frame = Number(frame)
    if (index === 0) { lowestKeyframe = frame }
    if (frame <= lowestKeyframe + animationClock) {
      min = frame
      minJoints = animatedModel.keyframes['' + frame]
    }
    if (frame >= lowestKeyframe + animationClock && !max) {
      max = frame
      maxJoints = animatedModel.keyframes['' + frame]
    }
  })

  var percentBetweenKeyframes = (lowestKeyframe + animationClock - min) / (max - min)
  var joint0 = createMatrix()
  var joint1 = createMatrix()
  interpolate(joint0, minJoints[0], maxJoints[0], percentBetweenKeyframes)
  interpolate(joint1, minJoints[1], maxJoints[1], percentBetweenKeyframes)

  gl.viewport(0, 0, viewport.width, viewport.height)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

  var pMatrix = makePerspective(Math.PI / 3, viewport.width / viewport.height, 1, 2000)

  var modelPosition = [0, 0, 0]
  var cameraMatrix = makeTranslation(0, 0, 10)
  // cameraMatrix = matrixMultiply(cameraMatrix, makeXRotation(0 - stuff.xRotation))
  // cameraMatrix = matrixMultiply(cameraMatrix, makeYRotation(0 + stuff.yRotation))
  var cameraPosition = [
    cameraMatrix[12],
    cameraMatrix[13],
    cameraMatrix[14]
  ]
  var up = [0, 1, 0]
  cameraMatrix = makeLookAt(cameraPosition, modelPosition, up)

  var viewMatrix = makeInverse(cameraMatrix)

  var modelMatrix = makeTranslation(modelPosition[0], modelPosition[1], modelPosition[2])
  modelMatrix = matrixMultiply(modelMatrix, viewMatrix)

  gl.bindBuffer(gl.ARRAY_BUFFER, animatedModel.vertexPositionBuffer)
  gl.vertexAttribPointer(shaderObject.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0)

  // Vertex weight
  gl.uniformMatrix4fv(shaderObject.boneMatrix0, false, joint0)
  gl.uniformMatrix4fv(shaderObject.boneMatrix1, false, joint1)

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, animatedModel.vertexPositionIndexBuffer)

  gl.uniformMatrix4fv(shaderObject.pMatrixUniform, false, pMatrix)
  gl.uniformMatrix4fv(shaderObject.mvMatrixUniform, false, modelMatrix)

  gl.drawElements(gl.TRIANGLES, 72, gl.UNSIGNED_SHORT, 0)
}
