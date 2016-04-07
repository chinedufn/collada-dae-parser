module.exports = ParseLibraryControllers

// TODO: Read  technique_commons instead of hard coding attribute locations
function ParseLibraryControllers (library_controllers) {
  var controller = library_controllers[0].controller
  if (controller) {
    // Joints
    var joints = controller[0].skin[0].source[0].Name_array[0]._.split(' ')
    console.log(joints)

    // Number of vertexes that need weights (should be number of joints)
    var numVertices = controller[0].skin[0].vertex_weights[0].$.count
    console.log(numVertices)

    // # of (joint,weight) pairs to read for each vertex
    // TODO: had to trim this.. should I trim everywhere?
    var jointWeightCounts = controller[0].skin[0].vertex_weights[0].vcount[0].trim().split(' ').map(Number)
    console.log(jointWeightCounts)

    // An array of all possible weights (I think?)
    var weightsArray = controller[0].skin[0].source[2].float_array[0]._.split(' ').map(Number)
    console.log(weightsArray)

    // Joint bind poses
    var bindPoses = controller[0].skin[0].source[1].float_array[0]._.split(' ').map(Number)
    joints.forEach(function (joint, index) {
      console.log(bindPoses.slice(16 * index, 16 * index + 16))
    })

    // Bind shape matrix
    var bindShapeMatrix = controller[0].skin[0].bind_shape_matrix[0].split(' ').map(Number)
    console.log(bindShapeMatrix)
  }
}
