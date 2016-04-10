var fs = require('fs')
var path = require('path')
var fragment = fs.readFileSync(path.resolve(__dirname, './fragment.glsl')).toString()
var vertex = fs.readFileSync(path.resolve(__dirname, './vertex.glsl')).toString()

module.exports = InitShaders

// TODO: Add error handling
function InitShaders (gl) {
  var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
  var vertexShader = gl.createShader(gl.VERTEX_SHADER)

  gl.shaderSource(fragmentShader, fragment)
  gl.compileShader(fragmentShader)

  gl.shaderSource(vertexShader, vertex)
  gl.compileShader(vertexShader)

  var shaderProgram = gl.createProgram()
  gl.attachShader(shaderProgram, fragmentShader)
  gl.attachShader(shaderProgram, vertexShader)
  gl.linkProgram(shaderProgram)
  gl.useProgram(shaderProgram)

  var vertexPositionAttribute = gl.getAttribLocation(shaderProgram, 'aVertexPosition')
  gl.enableVertexAttribArray(vertexPositionAttribute)

  return {
    program: shaderProgram,
    vertexPositionAttribute: vertexPositionAttribute,
    samplerUniform: gl.getUniformLocation(shaderProgram, 'uSampler'),
    pMatrixUniform: gl.getUniformLocation(shaderProgram, 'uPMatrix'),
    mvMatrixUniform: gl.getUniformLocation(shaderProgram, 'uMVMatrix')
  }
}
