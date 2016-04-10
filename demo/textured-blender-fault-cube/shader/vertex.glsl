attribute vec3 aVertexPosition;
attribute vec2 aWeight;

attribute float aJointIndex;
attribute float aJointWeight;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

uniform mat4 boneMatrices[2];

void main (void) {
  float foo = aJointIndex + aJointWeight;
  gl_Position = uPMatrix * uMVMatrix * boneMatrices[1] * vec4(aVertexPosition, 1.0);
}
