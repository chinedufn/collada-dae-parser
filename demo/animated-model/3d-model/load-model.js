var fs = require('fs')
var dae2json = require('../../../')

var initShaders = require('../shader/init-shader.js')

var expandVertices = require('./expand-vertices.js')

var drawModel = require('./draw-model.js')

module.exports = LoadModel

// TODO: clean up
function LoadModel (gl, opts) {
  // TODO: Read using xhr request
  var parsedDae = dae2json(fs.readFileSync('./demo/assets/collada-demo-animated-male.dae'))
  var vertexData = expandVertices(parsedDae)

  var vertexPositionBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(parsedDae.vertexPositions), gl.STATIC_DRAW)

  var vertexPositionIndexBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vertexPositionIndexBuffer)
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(vertexData.vertexPositionIndices), gl.STATIC_DRAW)

  // Joints the affect each vertex
  // TODO: naming
  var affectingJointIndexBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, affectingJointIndexBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData.vertexJointAffectors), gl.STATIC_DRAW)

  // Weights of affecting joints
  // TODO: naming
  var weightBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, weightBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData.vertexJointWeights), gl.STATIC_DRAW)

  var vertexNormalBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexNormalBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData.vertexNormals), gl.STATIC_DRAW)

  var shaderObj = initShaders(gl, {
    numJoints: vertexData.numJoints
  })

  // Return our draw function and keyframes
  // TODO: Can/should we avoid returning keyframes? Wrap their usage in a service?
  return {
    draw: drawModel.bind(null, gl, {
      vertexNormalBuffer: vertexNormalBuffer,
      vertexPositionBuffer: vertexPositionBuffer,
      vertexPositionIndexBuffer: vertexPositionIndexBuffer,
      affectingJointIndexBuffer: affectingJointIndexBuffer,
      weightBuffer: weightBuffer,
      numElements: vertexData.vertexPositionIndices.length,
      shaderObj: shaderObj
    }),
    keyframes: parsedDae.keyframes,
    // TODO: num joints has nothing to do with vertex data. parse this value elsewhere
    numJoints: vertexData.numJoints
  }
}
