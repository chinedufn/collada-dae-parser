module.exports = ParseVisualScenes

function ParseVisualScenes (library_visual_scenes) {
  var visualScene = library_visual_scenes[0].visual_scene[0]
  // Check for an instance controller. If one exists we have a skeleton
  var joints = []
  visualScene.node.forEach(function (node, index) {
    if (node.instance_controller) {
      // TODO: Do I need to remove the leading `#` ?
      joints = node.instance_controller[0].skeleton
    }
  })
  console.log(joints)
}
