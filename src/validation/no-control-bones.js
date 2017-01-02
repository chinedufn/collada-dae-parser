module.exports = noControlBones

// Validate that the rig does not
// contain any pole targets, inverse kinematic,
// or other non deformation bones
//
// The user must bake these animations before
// exporting their model.
//  [LINK TO DOCS]
function noControlBones (allJointNames, deformationJointNames) {
  // We know that there are no control bones if the number of bones
  // matches the number of deformation bones. Otherwise we throw a
  // descriptive error
  if (allJointNames.length !== deformationJointNames.length) {
    // Let's find the control joint names so that we can report
    // them to the user

    // [joint_1, joint_2] -> {joint_1: true, joint_2: true}
    // We're doing this in order to look up the missing elements
    var deformJoints = deformationJointNames.reduce(function (allJoints, jointName) {
      allJoints[jointName] = true
      return allJoints
    }, {})

    // Create an array of control joint names
    var nonDeformJoints = allJointNames.reduce(function (nonDeformJoints, jointName) {
      if (!deformJoints[jointName]) {
        nonDeformJoints.push(jointName)
      }
      return nonDeformJoints
    }, [])

    // Throw an error with a link to the documentation and the names of their non-deformation bones
    throw new Error(
      `
      It looks like you're trying to parse a model that has ${nonDeformJoints.length} non deformation bone${nonDeformJoints.length > 1 ? 's' : ''}.

        -> ${nonDeformJoints.join(', ')}

      ---

      These could be inverse kinematics bones, control bones, pole targets, or other
      helper bones.

      collada-dae-parser does not support non-deformation bones.

      You might try opening your model in your favorite modeling tool and
      baking the effects of your control bones into your deformation bones.

      ---

      Here's some documentation on how to account for your control bones in Blender:

        -> https://github.com/chinedufn/collada-dae-parser/blob/master/docs/blender-export/blender-export.md#control-joints
      `
    )
  }
}
