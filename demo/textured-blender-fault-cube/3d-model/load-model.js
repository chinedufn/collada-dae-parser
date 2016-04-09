var fs = require('fs')
var dae2json = require('../../../')
var animatedModel

module.exports = LoadModel

// TODO: clean up
function LoadModel (gl, callback) {
  // TODO: Read using xhr request
  dae2json(fs.readFileSync('./demo/assets/two-skinned-cubes.dae'), function (err, parsedDae) {
    if (err) { callback(err) }
    animatedModel = parsedDae

    var vertexPositionBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPositionBuffer.vertexPositions), gl.STATIC_DRAW)

    var vertexPositionIndices = []
    for (var i = 0; i < 6; i++) {
      var foo = i * 4
      vertexPositionIndices.push(animatedModel.vertexPositionIndices[foo])
      vertexPositionIndices.push(animatedModel.vertexPositionIndices[foo + 1])
      vertexPositionIndices.push(animatedModel.vertexPositionIndices[foo + 2])
      vertexPositionIndices.push(animatedModel.vertexPositionIndices[foo])
      vertexPositionIndices.push(animatedModel.vertexPositionIndices[foo + 2])
      vertexPositionIndices.push(animatedModel.vertexPositionIndices[foo + 3])
    }

    var vertexPositionIndexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vertexPositionIndexBuffer)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(vertexPositionIndices), gl.STATIC_DRAW)

    var stuff = {
      vertexPositionBuffer: vertexPositionBuffer,
      vertexPositionIndexBuffer: vertexPositionIndexBuffer
    }
    callback(null, stuff)
  })
}
