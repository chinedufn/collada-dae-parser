var parseXML = require('xml2js').parseString

module.exports = ParseCollada

// TODO:
// Parse Normals
// Parse Textures
// Parse Animations
// Clean Up Code / less confusing var names
function ParseCollada (colladaXML, callback) {
  parseXML(colladaXML, function (err, result) {
    if (err) {
      console.log('error', err)
    }
    var geometryMesh = result.COLLADA.library_geometries[0].geometry[0].mesh[0]
    var source = geometryMesh.source

    /* Vertex Positions, UVs, Normals */
    var polylistIndices = geometryMesh.polylist[0].p[0].split(' ')

    var vertexPositionIndices = []
    var vertexNormalIndices = []
    polylistIndices.forEach(function (vertexIndex, positionInArray) {
      if (positionInArray % 3 === 0) {
        vertexPositionIndices.push(Number(vertexIndex))
      } else if (positionInArray % 3 === 1) {
        vertexNormalIndices.push(Number(vertexIndex))
      }
    })
    var vertexPositions = source[0].float_array[0]._.split(' ').map(Number)
    var vertexNormals = source[1].float_array[0]._.split(' ').map(Number)
    /* End Vertex Positions, UVs, Normals */

    // Return our parsed collada object
    callback(null, {
      vertexNormalIndices: vertexNormalIndices,
      vertexNormals: vertexNormals,
      vertexPositions: vertexPositions,
      vertexPositionIndices: vertexPositionIndices
    })
  })
}
