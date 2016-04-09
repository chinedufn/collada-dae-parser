// Two cubes, each with their own joint (no parent child relationship)
// Animated on the Z axis. Y position never changes.
// They begin at two different X locations
//
// Note. 'Bone' and 'Bone_001' are the names of the joints exported from in Blender
// these could just as easily be 'foo' 'bar'
//
// TODO: Add a gif of every model
module.exports = {
  bindShapeMatrix: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
  vertexJointWeights: {
    // TODO: This feels wasteful / repetitive
    0: [ {'Bone': 1} ], 1: [ {'Bone': 1} ], 2: [ {'Bone': 1} ], 3: [ {'Bone': 1} ], 4: [ {'Bone': 1} ], 5: [ {'Bone': 1} ], 6: [ {'Bone': 1} ], 7: [ {'Bone': 1} ],
    8: [ {'Bone_001': 1} ], 9: [ {'Bone_001': 1} ], 10: [ {'Bone_001': 1} ], 11: [ {'Bone_001': 1} ], 12: [ {'Bone_001': 1} ], 13: [ {'Bone_001': 1} ], 14: [ {'Bone_001': 1} ], 15: [ {'Bone_001': 1} ]
  },
  vertexNormalIndices: [
    0, 0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 0, 0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 0, 0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 0, 0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5
  ],
  vertexNormals: [
    -1, 0, 0, 0, 1, 0, 1, 0, 0, 0, -1, 0, 0, 0, -1, 0, 0, 1
  ],
  vertexPositionIndices: [
    3, 2, 0, 7, 6, 2, 5, 4, 6, 1, 0, 4, 2, 6, 4, 7, 3, 1, 11, 10, 8, 15, 14, 10, 13, 12, 14, 9, 8, 12, 10, 14, 12, 15, 11, 9, 1, 3, 0, 3, 7, 2, 7, 5, 6, 5, 1, 4, 0, 2, 4, 5, 7, 1, 9, 11, 8, 11, 15, 10, 15, 13, 14, 13, 9, 12, 8, 10, 12, 13, 15, 9
  ],
  vertexPositions: [
    1.800068, -1, -1, 1.800068, -1, 1, 1.800068, 1, -1, 1.800068, 1, 1, 3.800068, -1, -1, 3.800068, -1, 1, 3.800068, 1, -1, 3.800068, 1, 1, -1, -1, -1, -1, -1, 1, -1, 1, -1, -1, 1, 1, 1, -1, -1, 1, -1, 1, 1, 1, -1, 1, 1, 1
  ]
}
