module.exports = ParseLibraryGeometries

function ParseLibraryGeometries (library_geometries) {
  var geometryMesh = library_geometries[0].geometry[0].mesh[0]
  var source = geometryMesh.source

  /* Vertex Positions, UVs, Normals */
  var polylistIndices = geometryMesh.polylist[0].p[0].split(' ')

  var vertexNormalIndices = []
  var vertexPositionIndices = []
  var vertexUVIndices = []
  // TODO: This is currently dependent on a certain vertex data order
  // we should instead read this order from the .dae file
  polylistIndices.forEach(function (vertexIndex, positionInArray) {
    if (positionInArray % source.length === 0) {
      vertexPositionIndices.push(Number(vertexIndex))
    } else if (positionInArray % source.length === 1) {
      vertexNormalIndices.push(Number(vertexIndex))
    }
    if (positionInArray % source.length === 2) {
      vertexUVIndices.push(Number(vertexIndex))
    }
  })
  var vertexPositions = source[0].float_array[0]._.split(' ').map(Number)
  var vertexNormals = source[1].float_array[0]._.split(' ').map(Number)
  var vertexUVs = []
  // TODO: use input, semantics, source, offset, etc
  if (source[2]) {
    vertexUVs = source[2].float_array[0]._.split(' ').map(Number)
  }
  /* End Vertex Positions, UVs, Normals */

  return {
    vertexPositions: vertexPositions,
    vertexNormals: vertexNormals,
    vertexUVs: vertexUVs,
    vertexNormalIndices: vertexNormalIndices,
    vertexPositionIndices: vertexPositionIndices,
    vertexUVIndices: vertexUVIndices
  }
}
