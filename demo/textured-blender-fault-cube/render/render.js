var matrixMultiply = require('./matrix-math/multiply.js')
var makeTranslation = require('./matrix-math/make-translation.js')
var makePerspective = require('./matrix-math/make-perspective.js')
// var makeYRotation = require('./matrix-math/make-y-rotation.js')
// var makeXRotation = require('./matrix-math/make-x-rotation.js')
var makeLookAt = require('./matrix-math/make-look-at.js')
var makeInverse = require('./matrix-math/make-inverse.js')
var interpolate = require('mat4-interpolate')
var createMatrix = require('gl-mat4/create')
var vec3Normalize = require('gl-vec3/normalize')
var vec3Scale = require('gl-vec3/scale')
var mat3FromMat4 = require('gl-mat3/from-mat4')
var mat3Invert = require('gl-mat3/invert')
var mat3Transpose = require('gl-mat3/transpose')

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
  var minJoints = []
  var maxJoints = []
  Object.keys(animatedModel.keyframes).sort().forEach(function (frame, index) {
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
  var joint2 = createMatrix()
  var joint3 = createMatrix()
  var joint4 = createMatrix()
  interpolate(joint0, minJoints[0], maxJoints[0], percentBetweenKeyframes)
  interpolate(joint1, minJoints[1], maxJoints[1], percentBetweenKeyframes)
  // Quickly adding in support for two other matrices. The model that we're currently using doesn't have 4 bones
  // so we're passing in two fake matrices (they've been weighted to zero). This is for easy modification with
  // your own models. In a real shader you might not be so wasteful
  interpolate(joint2, minJoints[2] || createMatrix(), maxJoints[2] || createMatrix(), percentBetweenKeyframes)
  interpolate(joint3, minJoints[3] || createMatrix(), maxJoints[3] || createMatrix(), percentBetweenKeyframes)
  interpolate(joint4, minJoints[4] || createMatrix(), maxJoints[4] || createMatrix(), percentBetweenKeyframes)

  gl.viewport(0, 0, viewport.width, viewport.height)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

  var pMatrix = makePerspective(Math.PI / 3, viewport.width / viewport.height, 1, 2000)

  var modelPosition = [0, 0, 0]
  var cameraMatrix = makeTranslation(0, 0, 15)
  // cameraMatrix = matrixMultiply(cameraMatrix, makeXRotation(0 - stuff.xRotation))
  // cameraMatrix = matrixMultiply(cameraMatrix, makeYRotation(Math.PI))
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

  // Vertex positions
  gl.bindBuffer(gl.ARRAY_BUFFER, animatedModel.vertexPositionBuffer)
  gl.vertexAttribPointer(shaderObject.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0)

  // Vertex normals
  gl.bindBuffer(gl.ARRAY_BUFFER, animatedModel.vertexNormalBuffer)
  gl.vertexAttribPointer(shaderObject.vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0)

  // vertex joints
  gl.bindBuffer(gl.ARRAY_BUFFER, animatedModel.affectingJointIndexBuffer)
  gl.vertexAttribPointer(shaderObject.jointIndexAttribute, 4, gl.FLOAT, false, 0, 0)

  // vertex joint weights
  gl.bindBuffer(gl.ARRAY_BUFFER, animatedModel.weightBuffer)
  gl.vertexAttribPointer(shaderObject.jointWeightAttribute, 4, gl.FLOAT, false, 0, 0)

  // lighting
  var lightingDirection = [-10, -5, -3]
  var normalizedLD = []
  vec3Normalize(normalizedLD, lightingDirection)
  vec3Scale(normalizedLD, normalizedLD, -1)

  gl.uniform3f(shaderObject.ambientColorUniform, 0.15, 0.1, 0.1)
  gl.uniform3fv(shaderObject.lightingDirectionUniform, normalizedLD)
  gl.uniform3f(shaderObject.directionalColorUniform, 0.1, 0.1, 0.75)

  // Vertex weight
  gl.uniformMatrix4fv(shaderObject.boneMatrix0, false, joint0)
  gl.uniformMatrix4fv(shaderObject.boneMatrix1, false, joint1)
  gl.uniformMatrix4fv(shaderObject.boneMatrix2, false, joint2)
  gl.uniformMatrix4fv(shaderObject.boneMatrix3, false, joint3)
  gl.uniformMatrix4fv(shaderObject.boneMatrix4, false, joint4)

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, animatedModel.vertexPositionIndexBuffer)

  gl.uniformMatrix4fv(shaderObject.pMatrixUniform, false, pMatrix)
  gl.uniformMatrix4fv(shaderObject.mvMatrixUniform, false, modelMatrix)
  // Set light uniform
  var normalMatrix = []
  mat3FromMat4(normalMatrix, modelMatrix)
  mat3Invert(normalMatrix, normalMatrix)
  mat3Transpose(normalMatrix, normalMatrix)
  gl.uniformMatrix3fv(shaderObject.nMatrixUniform, false, normalMatrix)

  gl.drawElements(gl.TRIANGLES, animatedModel.numElements, gl.UNSIGNED_SHORT, 0)
}
