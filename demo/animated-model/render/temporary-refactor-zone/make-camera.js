var makeTranslation = require('../matrix-math/make-translation.js')
var matrixMultiply = require('../matrix-math/multiply.js')
var makeYRotation = require('../matrix-math/make-y-rotation.js')
var makeXRotation = require('../matrix-math/make-x-rotation.js')
var makeLookAt = require('../matrix-math/make-look-at.js')

module.exports = makeCamera

function makeCamera (orbit, modelPosition) {
  var cameraMatrix = makeTranslation(0, 0, 3)
  cameraMatrix = matrixMultiply(cameraMatrix, makeXRotation(-orbit.xRadians))
  cameraMatrix = matrixMultiply(cameraMatrix, makeYRotation(orbit.yRadians))
  var cameraPosition = [
    cameraMatrix[12],
    cameraMatrix[13],
    cameraMatrix[14]
  ]
  var up = [0, 1, 0]
  cameraMatrix = makeLookAt(cameraPosition, modelPosition, up)

  return cameraMatrix
}
