attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aWeight;

attribute vec4 aJointIndex;
attribute vec4 aJointWeight;

uniform vec3 uAmbientColor;

uniform vec3 uLightingDirection;
uniform vec3 uDirectionalColor;

uniform mat3 uNMatrix;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

uniform mat4 boneMatrices[5];

varying vec3 vLightWeighting;

void main (void) {
  // Select joint matrix for this vertex
  mat4 jointMatrix0;
  mat4 jointMatrix1;
  mat4 jointMatrix2;
  mat4 jointMatrix3;
  mat4 weightedJointMatrix;
  // TODO: There has to be an easier way to do this in WebGL GLSL ...
  // Seems like you can't use variables as indices
  // For now we'll just chain all of these if statements
  if (aJointIndex.x < 1.0) {
    jointMatrix0 = boneMatrices[0];
  } else if (aJointIndex.x < 2.0) {
    jointMatrix0 = boneMatrices[1];
  } else if (aJointIndex.x < 3.0) {
    jointMatrix0 = boneMatrices[2];
  } else if (aJointIndex.x < 4.0) {
    jointMatrix0 = boneMatrices[3];
  } else if (aJointIndex.x < 5.0) {
    jointMatrix0 = boneMatrices[4];
  }
 if (aJointIndex.y < 1.0) {
    jointMatrix1 = boneMatrices[0];
  } else if (aJointIndex.y < 2.0) {
    jointMatrix1 = boneMatrices[1];
  } else if (aJointIndex.y < 3.0) {
    jointMatrix1 = boneMatrices[2];
  } else if (aJointIndex.y < 4.0) {
    jointMatrix1 = boneMatrices[3];
  } else if (aJointIndex.y < 5.0) {
    jointMatrix1 = boneMatrices[4];
  }
 if (aJointIndex.z < 1.0) {
    jointMatrix2 = boneMatrices[0];
  } else if (aJointIndex.z < 2.0) {
    jointMatrix2 = boneMatrices[1];
  } else if (aJointIndex.z < 3.0) {
    jointMatrix2 = boneMatrices[2];
  } else if (aJointIndex.z < 4.0) {
    jointMatrix2 = boneMatrices[3];
  } else if (aJointIndex.z < 5.0) {
    jointMatrix2 = boneMatrices[4];
  }

 // 4th Joint
 if (aJointIndex.w < 1.0) {
    jointMatrix3 = boneMatrices[0];
  } else if (aJointIndex.w < 2.0) {
    jointMatrix3 = boneMatrices[1];
  } else if (aJointIndex.w < 3.0) {
    jointMatrix3 = boneMatrices[2];
  } else if (aJointIndex.w < 4.0) {
    jointMatrix3 = boneMatrices[3];
  } else if (aJointIndex.w < 5.0) {
    jointMatrix3 = boneMatrices[4];
  }


  weightedJointMatrix += jointMatrix0 * aJointWeight.x;
  weightedJointMatrix += jointMatrix1 * aJointWeight.y;
  weightedJointMatrix += jointMatrix2 * aJointWeight.z;
  weightedJointMatrix += jointMatrix3 * aJointWeight.w;

  // Lighting
  vec3 transformedNormal = uNMatrix * aVertexNormal;
  float directionalLightWeighting = max(dot(transformedNormal, uLightingDirection), 0.0);
  vLightWeighting = uAmbientColor + uDirectionalColor * directionalLightWeighting;

  // Blender uses a right handed coordinate system. We convert to left handed here
  vec4 leftWorldSpace = weightedJointMatrix * vec4(aVertexPosition, 1.0);
  float y = leftWorldSpace.z;
  float z = -leftWorldSpace.y;
  leftWorldSpace.y = y;
  leftWorldSpace.z = z;

  // TODO: Is that even world space?. Just guessing and don't have wifi...
  vec4 leftHandedPosition = uPMatrix * uMVMatrix * leftWorldSpace;

  // We only have one index right now... so the weight is always 1.
  gl_Position = leftHandedPosition;
}
