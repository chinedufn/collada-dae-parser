module.exports = MakeYRotation

function MakeYRotation (angleInRadians) {
  var c = Math.cos(angleInRadians)
  var s = Math.sin(angleInRadians)

  return [
    c, 0, -s, 0,
    0, 1, 0, 0,
    s, 0, c, 0,
    0, 0, 0, 1
  ]
}
