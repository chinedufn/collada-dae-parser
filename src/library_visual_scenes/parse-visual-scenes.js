module.exports = ParseVisualScenes

// TODO: Handle child joints. Maybe depth first traversal?
function ParseVisualScenes (library_visual_scenes) {
  var visualScene = library_visual_scenes[0].visual_scene[0]
  var parsedJoints = {}

  // Some .dae files will export a shrunken model. Here's how to scale it
  var armatureScale = null
  visualScene.node.forEach(function (node) {
    // node.node is the location of all top level parent nodes
    if (node.node) {
      if (node.scale && node.scale.length > 0) {
        armatureScale = node.scale[0]._.split(' ').map(Number)
      }
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
    jointParents: parsedJoints,
    armatureScale: armatureScale
  }
}

// Recursively parse child joints
function parseJoints (node, parentJointName, accumulator) {
  accumulator = accumulator || {}
  node.forEach(function (joint) {
    accumulator[joint.$.sid] = accumulator[joint.$.sid] || {}
    // The bind pose of the matrix. We don't make use of this right now, but you would
    // use it to render a model in bind pose. Right now we only render the model based on
    // their animated joint positions, so we ignore this bind pose data
    accumulator[joint.$.sid].jointMatrix = joint.matrix[0]._.split(' ').map(Number)
    accumulator[joint.$.sid].parent = parentJointName
    if (joint.node) {
      parseJoints(joint.node, joint.$.sid, accumulator)
    }
  })

  return accumulator
}
