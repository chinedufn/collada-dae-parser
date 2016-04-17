var transpose = require('gl-mat4/transpose')

module.exports = ParseLibraryControllers

// TODO: Read  technique_commons instead of hard coding attribute locations
function ParseLibraryControllers (library_controllers) {
  var controller = library_controllers[0].controller
  if (controller) {
    // Number of vertexes that need weights
    // var numVertices = controller[0].skin[0].vertex_weights[0].$.count

    // # of (joint,weight) pairs to read for each vertex
    // TODO: had to trim this.. should I trim everywhere?
    var jointWeightCounts = controller[0].skin[0].vertex_weights[0].vcount[0].trim().split(' ').map(Number)

    // An array of all possible weights (I think?)
    var weightsArray = controller[0].skin[0].source[2].float_array[0]._.split(' ').map(Number)

    // Every (joint,weight). Use jointWeightCounts to know how many to read per vertex
    var parsedVertexJointWeights = []
    var jointsAndWeights = controller[0].skin[0].vertex_weights[0].v[0].split(' ').map(Number)
    jointWeightCounts.forEach(function (_, index) {
      var numJointWeightsToRead = jointWeightCounts[index]
      parsedVertexJointWeights[index] = {}
      for (var i = 0; i < numJointWeightsToRead; i++) {
        parsedVertexJointWeights[index][jointsAndWeights.shift()] = weightsArray[jointsAndWeights.shift()]
      }
    })

    // All of our models joints
    var orderedJointNames = controller[0].skin[0].source[0].Name_array[0]._.split(' ')

    // Joint bind poses
    // TODO: Should we multiply in the bind shape matrix?
    var jointBindPoses = {}
    var bindPoses = controller[0].skin[0].source[1].float_array[0]._.split(' ').map(Number)
    orderedJointNames.forEach(function (jointName, index) {
      var bindPose = bindPoses.slice(16 * index, 16 * index + 16)
      jointBindPoses[jointName] = bindPose
    })

    // Bind shape matrix (inverse bind matrix)
    var bindShapeMatrix = controller[0].skin[0].bind_shape_matrix[0].split(' ').map(Number)
    transpose(bindShapeMatrix, bindShapeMatrix)
  }
  // TODO: Should we also export the greatest number of joints for a vertex?
  // This might allow the consumer to use a shader that expects fewer joints
  // when skinning. i.e. mat4 vs mat3 or mat2 for weights
  return {
    bindShapeMatrix: bindShapeMatrix,
    jointBindPoses: jointBindPoses,
    orderedJointNames: orderedJointNames,
    vertexJointWeights: parsedVertexJointWeights
  }
}
