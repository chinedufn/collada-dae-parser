var fs = require('fs')
var dae2json = require('../../../')

module.exports = LoadModel

// TODO: clean up
function LoadModel (gl, callback) {
  // TODO: Read using xhr request
  dae2json(fs.readFileSync('./demo/assets/two-skinned-cubes.dae'), function (err, parsedDae) {
    if (err) { callback(err) }

    var vertexPositionBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(parsedDae.vertexPositions), gl.STATIC_DRAW)

    /*
    var vertexPositionIndices = []
    for (var i = 0; i < 6; i++) {
      var foo = i * 4
      vertexPositionIndices.push(parsedDae.vertexPositionIndices[foo])
      vertexPositionIndices.push(parsedDae.vertexPositionIndices[foo + 1])
      vertexPositionIndices.push(parsedDae.vertexPositionIndices[foo + 2])
      vertexPositionIndices.push(parsedDae.vertexPositionIndices[foo])
      vertexPositionIndices.push(parsedDae.vertexPositionIndices[foo + 2])
      vertexPositionIndices.push(parsedDae.vertexPositionIndices[foo + 3])
    }
    */

    var vertexPositionIndexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vertexPositionIndexBuffer)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(parsedDae.vertexPositionIndices), gl.STATIC_DRAW)

    var stuff = {
      vertexPositionBuffer: vertexPositionBuffer,
      vertexPositionIndexBuffer: vertexPositionIndexBuffer,
      keyframes: parsedDae.keyframes
    }
    callback(null, stuff)
  })
}
