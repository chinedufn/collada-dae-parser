var matrixMultiply = require('./matrix-math/multiply.js')
var makeTranslation = require('./matrix-math/make-translation.js')
var makePerspective = require('./matrix-math/make-perspective.js')
var makeYRotation = require('./matrix-math/make-y-rotation.js')
var makeXRotation = require('./matrix-math/make-x-rotation.js')
var makeLookAt = require('./matrix-math/make-look-at.js')
var makeInverse = require('./matrix-math/make-inverse.js')

var interpolateJoints = require('./temporary-refactor-zone/interpolate-joints.js')
var drawModel = require('./temporary-refactor-zone/draw-model.js')

module.exports = Render

// TODO: Pass in an object instead of a bunch of params
// TODO: There's a lot happening in here that should happen elsewhere (i.e. animation setup)
// will be easier to split out once we know what we're doing
function Render (gl, viewport, animatedModel, shaderObject, dt, state) {
  // TODO: get # joints from model
  var numJoints = 5
  var interpolatedJoints = interpolateJoints(animatedModel.keyframes, dt, numJoints)

  gl.viewport(0, 0, viewport.width, viewport.height)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

  var pMatrix = makePerspective(Math.PI / 3, viewport.width / viewport.height, 1, 2000)

  var modelPosition = [0, 0, 0]
  var cameraMatrix = makeTranslation(0, 0, 3)
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

  drawModel(gl, {
    interpolatedJoints: interpolatedJoints,
    modelData: animatedModel,
    position: modelPosition,
    perspectiveMatrix: pMatrix,
    shaderObj: shaderObject,
    viewMatrix: viewMatrix
  })
}
