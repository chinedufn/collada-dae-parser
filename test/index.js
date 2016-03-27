var fs = require('fs')
var path = require('path')

var test = require('tape')

var colladaFilePath = path.resolve(__dirname, './fixture/textured-blender-default-cube.dae')
var colladaXML = fs.readFileSync(colladaFilePath).toString('utf8')
var expectedTBDC = require('./expected/textured-blender-default-cube.js')

var parseCollada = require('../')

test('Parse a default blender cube with an added texture', function (t) {
  t.plan(1)
  parseCollada(colladaXML, function (err, parsedCube) {
    if (err) {
      t.fail()
    }
    t.deepEqual(parsedCube, expectedTBDC)
  })
})
