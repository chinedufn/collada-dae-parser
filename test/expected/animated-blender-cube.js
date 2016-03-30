// Animated default blender cube
// only X and Z locations are animated
// cube is not textured
module.exports = {
  keyframes: {
    0: {
      location: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }
    },
    '0.2083333': {
      location: { x: 0, y: 0, z: 2 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }
    },
    '0.4166666': {
      location: { x: 2, y: 0, z: 2 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }
    },
    '0.625': {
      location: { x: 2, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }
    },
    '0.8333333': {
      location: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }
    }
  },
  vertexNormalIndices: [
    0, 0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 7, 8, 8, 8, 9, 9, 9, 10, 10, 10, 11, 11, 11
  ],
  vertexNormals: [
    0, 0, -1, 0, 0, 1, 1, -5.96046e-7, 3.27825e-7, -4.76837e-7, -1, 0, -1, 2.38419e-7, -1.19209e-7, 2.08616e-7, 1, 0, 0, 0, -1, 0, 0, 1, 1, 0, -2.38419e-7, 0, -1, -4.76837e-7, -1, 2.38419e-7, -1.49012e-7, 2.68221e-7, 1, 2.38419e-7
  ],
  vertexPositionIndices: [
    0, 1, 2, 7, 6, 5, 4, 5, 1, 5, 6, 2, 2, 6, 7, 0, 3, 7, 3, 0, 2, 4, 7, 5, 0, 4, 1, 1, 5, 2, 3, 2, 7, 4, 0, 7
  ],
  vertexPositions: [
    1, 1, -1, 1, -1, -1, -1, -0.9999998, -1, -0.9999997, 1, -1, 1, 0.9999995, 1, 0.9999994, -1.000001, 1, -1, -0.9999997, 1, -1, 1, 1
  ]
}
