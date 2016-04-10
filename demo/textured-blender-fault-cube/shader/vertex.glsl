attribute vec3 aVertexPosition;
attribute vec2 aWeight;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

uniform mat4 boneMatrix0;
uniform mat4 boneMatrix1;

void main (void) {
  gl_Position = uPMatrix * uMVMatrix * boneMatrix1 * vec4(aVertexPosition, 1.0);
}
