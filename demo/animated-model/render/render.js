var matrixMultiply = require('./matrix-math/multiply.js')
var makeTranslation = require('./matrix-math/make-translation.js')
var makePerspective = require('./matrix-math/make-perspective.js')
var makeYRotation = require('./matrix-math/make-y-rotation.js')
var makeXRotation = require('./matrix-math/make-x-rotation.js')
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
function Render (gl, viewport, animatedModel, shaderObject, dt, state) {
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
    animationClock %= animationDuration
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
  var interpolatedJoints = []
  var numJoints = 5
  for (var i = 0; i < numJoints; i++) {
    interpolatedJoints[i] = createMatrix()
    interpolate(interpolatedJoints[i], minJoints[i], maxJoints[i], percentBetweenKeyframes)
  }

  gl.viewport(0, 0, viewport.width, viewport.height)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

  var pMatrix = makePerspective(Math.PI / 3, viewport.width / viewport.height, 1, 2000)

  var modelPosition = [0, 0, 0]
  var cameraMatrix = makeTranslation(0, 0, 20)
  cameraMatrix = matrixMultiply(cameraMatrix, makeXRotation(-state.orbit.xRadians))
  cameraMatrix = matrixMultiply(cameraMatrix, makeYRotation(state.orbit.yRadians))
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
  var lightingDirection = [0, 0, 1]
  var normalizedLD = []
  vec3Normalize(normalizedLD, lightingDirection)
  vec3Scale(normalizedLD, normalizedLD, -1)

  gl.uniform3f(shaderObject.ambientColorUniform, 0.5, 0.5, 0.5)
  gl.uniform3fv(shaderObject.lightingDirectionUniform, normalizedLD)
  gl.uniform3f(shaderObject.directionalColorUniform, 1.0, 1.0, 1.0)

  // Vertex weight
  gl.uniformMatrix4fv(shaderObject.boneMatrix0, false, interpolatedJoints[0])
  gl.uniformMatrix4fv(shaderObject.boneMatrix1, false, interpolatedJoints[1])
  gl.uniformMatrix4fv(shaderObject.boneMatrix2, false, interpolatedJoints[2])
  gl.uniformMatrix4fv(shaderObject.boneMatrix3, false, interpolatedJoints[3])
  gl.uniformMatrix4fv(shaderObject.boneMatrix4, false, interpolatedJoints[4])

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
