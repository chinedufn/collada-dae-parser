module.exports = make2dProjection

function make2dProjection (width, height, depth) {
  // Note: this matrix flips the Y axis so 0 is at the top
  return [
    2 / width, 0, 0, 0,
    0, -2 / height, 0, 0,
    0, 0, 2 / depth, 0,
    -1, 1, 0, 1
  ]
}
