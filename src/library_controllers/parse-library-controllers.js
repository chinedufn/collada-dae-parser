var transpose = require('gl-mat4/transpose')

module.exports = ParseLibraryControllers

// TODO: Read  technique_commons instead of hard coding attribute locations
function ParseLibraryControllers (library_controllers) {
  var controller = library_controllers[0].controller
  if (controller) {
    // All of our models joints
    var joints = controller[0].skin[0].source[0].Name_array[0]._.split(' ')

    // Number of vertexes that need weights
    // var numVertices = controller[0].skin[0].vertex_weights[0].$.count

    // # of (joint,weight) pairs to read for each vertex
    // TODO: had to trim this.. should I trim everywhere?
    var jointWeightCounts = controller[0].skin[0].vertex_weights[0].vcount[0].trim().split(' ').map(Number)

    // An array of all possible weights (I think?)
    var weightsArray = controller[0].skin[0].source[2].float_array[0]._.split(' ').map(Number)

    // Every (joint,weight). Use jointWeightCounts to know how many to read per vertex
    var parsedVertexJointWeights = {}
    var jointsAndWeights = controller[0].skin[0].vertex_weights[0].v[0].split(' ').map(Number)
    jointWeightCounts.forEach(function (_, index) {
      var numJointWeightsToRead = jointWeightCounts[index]
      parsedVertexJointWeights[index] = []
      for (var i = 0; i < numJointWeightsToRead; i++) {
        // TODO: Should we index by the actual index number or the joint name?
        var newJointWeightPair = {}
        newJointWeightPair[joints[jointsAndWeights.shift()]] = weightsArray[jointsAndWeights.shift()]
        parsedVertexJointWeights[index].push(newJointWeightPair)
      }
    })

    // Joint bind poses
    var bindPoses = controller[0].skin[0].source[1].float_array[0]._.split(' ').map(Number)
    joints.forEach(function (joint, index) {
      console.log(bindPoses.slice(16 * index, 16 * index + 16))
    })

    // Bind shape matrix (inverse bind matrix)
    var bindShapeMatrix = controller[0].skin[0].bind_shape_matrix[0].split(' ').map(Number)
    transpose(bindShapeMatrix, bindShapeMatrix)
  }
  return {
    bindShapeMatrix: bindShapeMatrix,
    vertexJointWeights: parsedVertexJointWeights
  }
}
