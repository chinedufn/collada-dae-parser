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

  var vertexNormalAttribute = gl.getAttribLocation(shaderProgram, 'aVertexNormal')
  gl.enableVertexAttribArray(vertexNormalAttribute)

  var jointIndexAttribute = gl.getAttribLocation(shaderProgram, 'aJointIndex')
  gl.enableVertexAttribArray(jointIndexAttribute)

  var jointWeightAttribute = gl.getAttribLocation(shaderProgram, 'aJointWeight')
  gl.enableVertexAttribArray(jointWeightAttribute)

  return {
    ambientColorUniform: gl.getUniformLocation(shaderProgram, 'uAmbientColor'),
    lightingDirectionUniform: gl.getUniformLocation(shaderProgram, 'uLightingDirection'),
    directionalColorUniform: gl.getUniformLocation(shaderProgram, 'uDirectionalColor'),
    nMatrixUniform: gl.getUniformLocation(shaderProgram, 'uNMatrix'),
    program: shaderProgram,
    vertexPositionAttribute: vertexPositionAttribute,
    vertexNormalAttribute: vertexNormalAttribute,
    jointIndexAttribute: jointIndexAttribute,
    jointWeightAttribute: jointWeightAttribute,
    samplerUniform: gl.getUniformLocation(shaderProgram, 'uSampler'),
    pMatrixUniform: gl.getUniformLocation(shaderProgram, 'uPMatrix'),
    mvMatrixUniform: gl.getUniformLocation(shaderProgram, 'uMVMatrix'),
    boneMatrix0: gl.getUniformLocation(shaderProgram, 'boneMatrices[0]'),
    boneMatrix1: gl.getUniformLocation(shaderProgram, 'boneMatrices[1]'),
    boneMatrix2: gl.getUniformLocation(shaderProgram, 'boneMatrices[2]'),
    boneMatrix3: gl.getUniformLocation(shaderProgram, 'boneMatrices[3]'),
    boneMatrix4: gl.getUniformLocation(shaderProgram, 'boneMatrices[4]')
  }
}
