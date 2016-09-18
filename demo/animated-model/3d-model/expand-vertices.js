module.exports = expandVertices

// Takes our parsed data and expands the vertex data using our uv/vertex/normal index data
function expandVertices (parsedDae) {
  // Vertex normals
  // TODO: Comment this
  var vertexNormals = []

  // TODO: naming
  var vertexJointAffectors = []
  var vertexJointWeights = []
  /*
     parsedDae.vertexJointWeights.forEach(function (jointsAndWeights) {
     for (var i = 0; i < 4; i++) {
     var jointIndex = Object.keys(jointsAndWeights)[i]
     vertexJointAffectors.push(Number(jointIndex) || 0)
     vertexJointWeights.push(jointsAndWeights[jointIndex] || 0)
     }
     })
     */

  // TODO: Can probably make this more efficient by indexing duplicate index -> normal -> new tail end index
  // TODO: generally inefficient. Running calculations more than necessary. Still figuring out how to do this...
  //  Throwing things in for now then optimize later
  var encounteredIndices = {}
  var vertexPositionIndices = []
  var largestPositionIndex = 0
  parsedDae.vertexPositionIndices.forEach(function (vertexPositionIndex, counter) {
    largestPositionIndex = Math.max(largestPositionIndex, vertexPositionIndex)
    if (!encounteredIndices[vertexPositionIndex]) {
      var jointsAndWeights = parsedDae.vertexJointWeights[vertexPositionIndex]
      // First time seeing the vertex position index
      vertexPositionIndices[counter] = vertexPositionIndex
      for (var i = 0; i < 4; i++) {
        if (i < 3) {
          vertexNormals[vertexPositionIndex * 3 + i] = parsedDae.vertexNormals[parsedDae.vertexNormalIndices[counter] * 3 + i]
        }
        var jointIndex = Object.keys(jointsAndWeights)[i]
        // TODO: Should zero be -1? It will have a zero weight regardless, but that lets us distinguish between empty bone slots and zero index bone slots
        vertexJointAffectors[vertexPositionIndex * 4 + i] = Number(jointIndex) || 0
        vertexJointWeights[vertexPositionIndex * 4 + i] = jointsAndWeights[jointIndex] || 0
      }
      encounteredIndices[vertexPositionIndex] = true
    }
  })
  parsedDae.vertexPositionIndices.forEach(function (vertexPositionIndex, counter) {
    if (encounteredIndices[vertexPositionIndex]) {
      vertexPositionIndices[counter] = ++largestPositionIndex
      var jointsAndWeights = parsedDae.vertexJointWeights[vertexPositionIndex]
      for (var i = 0; i < 4; i++) {
        if (i < 3) {
          parsedDae.vertexPositions[largestPositionIndex * 3 + i] = parsedDae.vertexPositions[vertexPositionIndex * 3 + i]
          vertexNormals[largestPositionIndex * 3 + i] = parsedDae.vertexNormals[parsedDae.vertexNormalIndices[counter] * 3 + i]
        }
        var jointIndex = Object.keys(jointsAndWeights)[i]
        // TODO: Should zero be -1? It will have a zero weight regardless, but that lets us distinguish between empty bone slots and zero index bone slots
        vertexJointAffectors[largestPositionIndex * 4 + i] = Number(jointIndex) || 0
        vertexJointWeights[largestPositionIndex * 4 + i] = jointsAndWeights[jointIndex] || 0
      }
    }
  })

  // We count the number of matrices in one of the keyframes
  // There *should* be one matrix per joint
  // All keyframes *should* have the same number of joints
  var firstKeyframeTime = Object.keys(parsedDae.keyframes).slice(0, 1)
  var numJoints = parsedDae.keyframes[firstKeyframeTime].length

  return {
    // TODO: This has nothing to do with expanding joints. Calculate elsewhere
    numJoints: numJoints,
    vertexNormals: vertexNormals,
    vertexPositionIndices: vertexPositionIndices,
    vertexJointAffectors: vertexJointAffectors,
    vertexJointWeights: vertexJointWeights
  }
}
