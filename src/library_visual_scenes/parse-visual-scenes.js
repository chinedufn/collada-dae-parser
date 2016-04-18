module.exports = ParseVisualScenes

// TODO: Handle child joints. Maybe depth first traversal?
function ParseVisualScenes (library_visual_scenes) {
  var visualScene = library_visual_scenes[0].visual_scene[0]
  var parsedJoints = []

  // TODO: Not sure if we're actually scaling the armature. It seems
  // like we need to apply these transformations to the top level joints
  var armatureScale = []
  visualScene.node.forEach(function (node) {
    // This is the location of all top level parent nodes
    if (node.node) {
      // node.node is the location of all top level nodes
      armatureScale = node.scale[0]._.split(' ').map(Number)
      parsedJoints = parseJoints(node.node)
    }
    /*
    // Check for an instance controller. If one exists we have a skeleton
    if (node.instance_controller) {
    // TODO: Do I need to remove the leading `#` ?
    joints = node.instance_controller[0].skeleton
    }
    */
  })

  return {
    jointRelationships: parsedJoints,
    armatureScale: armatureScale
  }
}

// Recursively parse child joints
// TODO: factor in parent world matrix
// TODO: Facilitate depth first traversal?
function parseJoints (node, parentJointName, accumulator) {
  accumulator = accumulator || []
  node.forEach(function (joint) {
    accumulator[joint.$.sid] = accumulator[joint.$.sid] || {}
    accumulator[joint.$.sid].jointMatrix = joint.matrix[0]._.split(' ').map(Number)
    accumulator[joint.$.sid].parent = parentJointName
    if (joint.node) {
      parseJoints(joint.node, joint.$.sid, accumulator)
    }
  })

  return accumulator
}
