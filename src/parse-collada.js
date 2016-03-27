var parseXML = require('xml2js').parseString

module.exports = ParseCollada

// TODO:
// Parse Normals
// Parse Textures
// Parse Animations
// Clean Up Code
function ParseCollada (colladaXML, callback) {
  parseXML(colladaXML, function (err, result) {
    if (err) {
      console.log('error', err)
    }
    var geometryMesh = result.COLLADA.library_geometries[0].geometry[0].mesh[0]
    var source = geometryMesh.source
    // console.log(geometryMesh.vertices[0].input)

    /* Positions, Vertices, Normals */

    var accessor = source[0].technique_common[0].accessor
    var x = accessor[0].param[0].$.name
    var y = accessor[0].param[1].$.name
    var z = accessor[0].param[2].$.name
    if (x === 'X' && y === 'Y' && z === 'Z') {
      // var accessorCount = accessor[0].$.count
      // var accessorStride = accessor[0].$.stride
      var source1 = source[0].float_array[0]
      var vertexPositions = source1._.split(' ').map(Number)
      // var vertexPositionCount = source1.$.count
    }
    var polylistIndices = geometryMesh.polylist[0].p[0].split(' ')
    var vertexPositionIndices = []
    polylistIndices.forEach(function (vertexIndex, positionInArray) {
      if (positionInArray % 3 === 0) {
        vertexPositionIndices.push(vertexIndex)
      }
    })
    vertexPositionIndices = vertexPositionIndices.map(Number)

    // Return our parsed collada object
    callback(null, {
      vertexPositions: vertexPositions,
      vertexPositionIndices: vertexPositionIndices
    })
  })
}
