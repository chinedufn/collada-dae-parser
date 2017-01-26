var fs = require('fs')
var path = require('path')
var fragment = fs.readFileSync(path.resolve(__dirname, './fragment.glsl')).toString()
var vertex = fs.readFileSync(path.resolve(__dirname, './vertex.glsl')).toString()

module.exports = InitShaders

// TODO: Add error handling
function InitShaders (gl, opts) {
  var numJoints = opts.numJoints

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

  var shaderObj = {
    ambientColorUniform: gl.getUniformLocation(shaderProgram, 'uAmbientColor'),
    lightingDirectionUniform: gl.getUniformLocation(shaderProgram, 'uLightingDirection'),
    directionalColorUniform: gl.getUniformLocation(shaderProgram, 'uDirectionalColor'),
    program: shaderProgram,
    vertexPositionAttribute: vertexPositionAttribute,
    vertexNormalAttribute: vertexNormalAttribute,
    jointIndexAttribute: jointIndexAttribute,
    jointWeightAttribute: jointWeightAttribute,
    samplerUniform: gl.getUniformLocation(shaderProgram, 'uSampler'),
    pMatrixUniform: gl.getUniformLocation(shaderProgram, 'uPMatrix'),
    mvMatrixUniform: gl.getUniformLocation(shaderProgram, 'uMVMatrix')
  }

  for (var jointNum = 0; jointNum < numJoints; jointNum++) {
    shaderObj['boneMatrix' + jointNum] = gl.getUniformLocation(shaderProgram, 'boneMatrices[' + jointNum + ']')
    // Split our dual quaternion into two vec4's since we can't use mat2x4 in WebGL
    shaderObj['boneRotQuaternion' + jointNum] = gl.getUniformLocation(shaderProgram, 'boneRotQuaternions[' + jointNum + ']')
    shaderObj['boneTransQuaternion' + jointNum] = gl.getUniformLocation(shaderProgram, 'boneTransQuaternions[' + jointNum + ']')
  }

  return shaderObj
}
