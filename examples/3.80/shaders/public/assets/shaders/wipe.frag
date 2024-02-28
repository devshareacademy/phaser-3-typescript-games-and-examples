#define SHADER_NAME WIPE

#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D uMainSampler;
// coordinate from the vertext shader
varying vec2 outTexCoord;
uniform float uCutoff;

void main() {
  if (outTexCoord.x < uCutoff) {
    gl_FragColor = vec4(0.0, 0.0, 0.0, 1);
  } else {
    // returns the original color of the pixel that is being processed
    gl_FragColor = texture2D(uMainSampler, outTexCoord);
  }
}
