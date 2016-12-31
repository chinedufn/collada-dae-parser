var fs = require('fs')
var path = require('path')

var test = require('tape')
var parseCollada = require('../../')

var colladaFilePath = path.resolve(__dirname, './leg-with-control-bones.dae')
var legWithControlBonesXML = fs.readFileSync(colladaFilePath)

// If you have a rig that uses inverse kinematics, pole targets,
// or other control bones you'll need to bake the animation into
// your deformation bones and then export your collada file
// without the control bones.
//
// Documentation on this lives here:
//  [LINK TO DOCS]
test('Throw error if there are non deformation bones', function (t) {
  t.throws(parseCollada.bind(null, legWithControlBonesXML), /control bone/, 'Throws if collada contains control bones')
  t.end()
})
