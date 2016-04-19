var render = require('./render/render.js')
var document = require('global/document')
var loop = require('raf-loop')
var loadModel = require('./3d-model/load-model.js')
var initShaders = require('./shader/init-shader.js')
var SS = require('solid-state')
var animate = require('./animate/animate.js')
var initControls = require('./control/orbit-controls.js')

module.exports = BlenderCubeCanvas

function BlenderCubeCanvas () {
  var AppState = new SS({
    currentlyPressedKeys: {},
    orbit: {yRadians: 0, xRadians: 0}
  })
  var canvas = document.createElement('canvas')
  canvas.width = 680
  canvas.height = 420

  var gl = canvas.getContext('webgl')
  gl.clearColor(0.0, 0.0, 0.0, 1.0)
  gl.enable(gl.DEPTH_TEST)

  var viewport = {height: canvas.height, width: canvas.width}
  var shaderObject = initShaders(gl)
  initControls(AppState)

  loadModel(gl, function (err, modelData) {
    if (err) { console.log(err) }

    loop(function (dt) {
      animate(AppState)
      // TODO: Pull out some of the animation happening in render
      // TODO: Clean up params
      render(gl, viewport, modelData, shaderObject, dt, AppState.get())
    }).start()
  })

  return {
    element: canvas
  }
}
