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

// TODO: Generate this shader at runtime with proper num joints
uniform mat4 boneMatrices[32];
uniform mat3 boneNormals[32];

uniform vec4 boneRotQuaternions[32];
uniform vec4 boneTransQuaternions[32];

varying vec3 vLightWeighting;

void main (void) {
  // Select joint matrix for this vertex

  // TODO: Just store the indices instead of copying over the matrices
  //  i.e. float array of indices instead of matrices
  mat4 jointMatrix[4];
  mat3 normalMatrix[4];
  vec4 rotQuaternion[4];
  vec4 transQuaternion[4];

  mat4 weightedJointMatrix;
  mat3 weightedNormalMatrix;

  for (int i = 0; i < 32; i++) {
    if (aJointIndex.x == float(i)) {
      jointMatrix[0] = boneMatrices[i];
      normalMatrix[0] = boneNormals[i];
      rotQuaternion[0] = boneRotQuaternions[i];
      transQuaternion[0] = boneTransQuaternions[i];
    }
    if (aJointIndex.y == float(i)) {
      jointMatrix[1] = boneMatrices[i];
      normalMatrix[1] = boneNormals[i];
      rotQuaternion[1] = boneRotQuaternions[i];
      transQuaternion[1] = boneTransQuaternions[i];
    }
    if (aJointIndex.z == float(i)) {
      jointMatrix[2] = boneMatrices[i];
      normalMatrix[2] = boneNormals[i];
      rotQuaternion[2] = boneRotQuaternions[i];
      transQuaternion[2] = boneTransQuaternions[i];
    }
    if (aJointIndex.w == float(i)) {
      jointMatrix[3] = boneMatrices[i];
      normalMatrix[3] = boneNormals[i];
      rotQuaternion[3] = boneRotQuaternions[i];
      transQuaternion[3] = boneTransQuaternions[i];
    }
  }

  // `+=` wasn't working on some devices
  weightedJointMatrix = jointMatrix[0] * aJointWeight.x +
    jointMatrix[1] * aJointWeight.y +
    jointMatrix[2] * aJointWeight.z +
    jointMatrix[3] * aJointWeight.w;

  weightedNormalMatrix = normalMatrix[0] * aJointWeight.x +
    normalMatrix[1] * aJointWeight.y +
    normalMatrix[2] * aJointWeight.z +
    normalMatrix[3] * aJointWeight.w;

  vec4 weightedRotQuats = rotQuaternion[0] * aJointWeight.x +
    rotQuaternion[1] * aJointWeight.y +
    rotQuaternion[2] * aJointWeight.z +
    rotQuaternion[3] * aJointWeight.w;

  vec4 weightedTransQuats = transQuaternion[0] * aJointWeight.x +
    transQuaternion[1] * aJointWeight.y +
    transQuaternion[2] * aJointWeight.z +
    transQuaternion[3] * aJointWeight.w;

  // Normalize function
  float normalizedRot;
  float xRot = weightedRotQuats[0];
  float yRot = weightedRotQuats[1];
  float zRot = weightedRotQuats[2];
  float wRot = weightedRotQuats[3];
  normalizedRot = sqrt(xRot * xRot + yRot * yRot + zRot * zRot + wRot * wRot);

  // Normalize our dual quaternion
  //  equation: https://www.cs.utah.edu/~ladislav/kavan07skinning/kavan07skinning.pdf
  weightedRotQuats = weightedRotQuats / normalizedRot;
  weightedTransQuats = weightedTransQuats / normalizedRot;

  float xR = weightedRotQuats[0];
  float yR = weightedRotQuats[1];
  float zR = weightedRotQuats[2];
  float wR = weightedRotQuats[3];

  float xT = weightedTransQuats[0];
  float yT = weightedTransQuats[1];
  float zT = weightedTransQuats[2];
  float wT = weightedTransQuats[3];

  float t0 = 2.0 * (-wT * xR + xT * wR - yT * zR + zT * yR);
  float t1 = 2.0 * (-wT * yR + xT * zR + yT * wR - zT * xR);
  float t2 = 2.0 * (-wT * zR - xT * yR + yT * xR + zT * wR);

  mat4 convertedMatrix = mat4(
      1.0 - (2.0 * yR * yR) - (2.0 * zR * zR),
      (2.0 * xR * yR) + (2.0 * wR * zR),
      (2.0 * xR * zR) - (2.0 * wR * yR),
      0,
      (2.0 * xR * yR) - (2.0 * wR * zR),
      1.0 - (2.0 * xR * xR) - (2.0 * zR * zR),
      (2.0 * yR * zR) + (2.0 * wR * xR),
      0,
      (2.0 * xR * zR) + (2.0 * wR * yR),
      (2.0 * yR * zR) - (2.0 * wR * xR),
      1.0 - (2.0 * xR * xR) - (2.0 * yR * yR),
      0,
      t0,
      t1,
      t2,
      1
      );

  // Lighting
  vec3 transformedNormal = weightedNormalMatrix * aVertexNormal;
  float y;
  float z;
  y = transformedNormal.z;
  z = -transformedNormal.y;
  transformedNormal.y = y;
  transformedNormal.z = z;

  float directionalLightWeighting = max(dot(transformedNormal, uLightingDirection), 0.0);
  vLightWeighting = uAmbientColor + uDirectionalColor * directionalLightWeighting;

  // Blender uses a right handed coordinate system. We convert to left handed here
  vec4 leftWorldSpace = convertedMatrix * vec4(aVertexPosition, 1.0);
  y = leftWorldSpace.z;
  z = -leftWorldSpace.y;
  leftWorldSpace.y = y;
  leftWorldSpace.z = z;

  // TODO: Is that even called world space?
  vec4 leftHandedPosition = uPMatrix * uMVMatrix * leftWorldSpace;

  // We only have one index right now... so the weight is always 1.
  gl_Position = leftHandedPosition;
}
