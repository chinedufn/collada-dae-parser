module.exports = Render

function Render (gl, viewport) {
  gl.viewport(0, 0, viewport.width, viewport.height)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
}
