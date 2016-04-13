precision mediump float;

varying vec3 vLightWeighting;

void main(void) {
    vec3 baseColor = vec3(1.0, 1.0, 1.0);
    gl_FragColor = vec4(baseColor * vLightWeighting, 1.0);
}
