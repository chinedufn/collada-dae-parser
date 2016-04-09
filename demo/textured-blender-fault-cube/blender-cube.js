var render = require('./render/render.js')
var document = require('global/document')
var loop = require('raf-loop')
var loadModel = require('./3d-model/load-model.js')

module.exports = BlenderCubeCanvas

function BlenderCubeCanvas () {
  var canvas = document.createElement('canvas')
  canvas.width = 680
  canvas.height = 420

  var gl = canvas.getContext('webgl')
  gl.clearColor(0.0, 0.0, 0.0, 1.0)
  gl.enable(gl.DEPTH_TEST)

  var viewport = {height: canvas.height, width: canvas.width}

  loadModel(gl, function (err, modelData) {
    if (err) { console.log(err) }

    loop(function (dt) {
      render(gl, viewport, modelData)
    }).start()
  })

  return {
    element: canvas
  }
}
