module.exports = ParseVisualScenes

// TODO: Handle child joints. Maybe depth first traversal?
function ParseVisualScenes (library_visual_scenes) {
  var visualScene = library_visual_scenes[0].visual_scene[0]
  // Check for an instance controller. If one exists we have a skeleton
  // var joints = []
  var parsedJoints = []
  visualScene.node.forEach(function (node) {
    if (node.node) {
      node.node.forEach(function (joint) {
        parsedJoints[joint.$.sid] = parsedJoints[joint.$.sid] || {}
        parsedJoints[joint.$.sid].jointMatrix = joint.matrix[0]._.split(' ').map(Number)
      })
    }
    /*
    if (node.instance_controller) {
      // TODO: Do I need to remove the leading `#` ?
      joints = node.instance_controller[0].skeleton
    }
    */
  })

  return parsedJoints
}
