attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aWeight;

attribute float aJointIndex;
attribute float aJointWeight;

uniform vec3 uAmbientColor;

uniform vec3 uLightingDirection;
uniform vec3 uDirectionalColor;

uniform mat3 uNMatrix;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

uniform mat4 boneMatrices[2];

varying vec3 vLightWeighting;

void main (void) {
  // Select joint matrix for this vertex
  mat4 jointMatrix;
  if (aJointIndex < 1.0) {
    jointMatrix = boneMatrices[0];
  } else if (aJointIndex < 2.0) {
    jointMatrix = boneMatrices[1];
  }

  // Lighting
  vec3 transformedNormal = uNMatrix * aVertexNormal;
  float directionalLightWeighting = max(dot(transformedNormal, uLightingDirection), 0.0);
  vLightWeighting = uAmbientColor + uDirectionalColor * directionalLightWeighting;

  // Blender uses a right handed coordinate system. We convert to left handed here
  vec4 leftWorldSpace = jointMatrix * aJointWeight * vec4(aVertexPosition, 1.0);
  float y = leftWorldSpace.z;
  float z = -leftWorldSpace.y;
  leftWorldSpace.y = y;
  leftWorldSpace.z = z;

  // TODO: Is that even world space?. Just guessing and don't have wifi...
  vec4 leftHandedPosition = uPMatrix * uMVMatrix * leftWorldSpace;

  // We only have one index right now... so the weight is always 1.
  gl_Position = leftHandedPosition;
}
