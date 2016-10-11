var fs = require('fs')
var path = require('path')

var test = require('tape')
var parseCollada = require('../../../')

var multipleMeshFilePath = path.resolve(__dirname, './multiple-meshes_blender_model.dae')
var multipleMeshBlenderXML = fs.readFileSync(multipleMeshFilePath)

test('Throw error if model has multiple meshes (geometries)', function (t) {
  t.plan(1)
  t.throws(
    parseCollada.bind(null, multipleMeshBlenderXML),
    /It looks like you're trying to parse a model that has 2 geometries/,
    'Throws an error if there are multiple geometries'
  )
})
