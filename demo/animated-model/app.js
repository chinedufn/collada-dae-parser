var render = require('./render/render.js')
var document = require('global/document')
var loop = require('raf-loop')
var loadModel = require('./3d-model/load-model.js')
var SS = require('solid-state')
var animate = require('./animate/animate.js')
var viewportResize = require('./viewport/viewport-resize.js')
var initControls = require('./control/init-control.js')
var initTargets = require('./init-target/init-target.js')

module.exports = BlenderCubeCanvas

function BlenderCubeCanvas () {
  var AppState = new SS({
    currentlyPressedKeys: {},
    currentAnimation: [0, 4],
    orbit: {yRadians: -1.9, xRadians: 1.05},
    viewport: { width: 680, height: 420 }
  })
  AppState.set('targets', initTargets(AppState))

  var canvas = document.createElement('canvas')
  canvas.style.width = '100%'
  canvas.style.height = '100%'
  viewportResize(AppState, canvas)

  var gl = canvas.getContext('webgl')
  gl.clearColor(0.0, 0.0, 0.0, 1.0)
  gl.enable(gl.DEPTH_TEST)

  initControls(AppState)

  var modelData = loadModel(gl, {
    animations: {
      'foo': [0, 1],
      'bar': [2, 3]
    }
  })

  loop(function (dt) {
    animate(AppState)
    // TODO: Pull out some of the animation happening in render
    // TODO: Clean up params
    render(gl, modelData, dt, AppState.get())
  }).start()

  return {
    element: canvas
  }
}
