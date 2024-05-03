import { CustomPipeline } from './custom-pipeline';

const frag = `
#define SHADER_NAME FADE_TO_BLACK_POST_FX

#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D uMainSampler;
// coordinate from the vertex shader
varying vec2 outTexCoord;
uniform float uCutoff;

vec4 black = vec4(0.0, 0.0, 0.0, 1.0);

void main() {
  vec4 color = texture2D(uMainSampler, outTexCoord);
  gl_FragColor = mix(color, black, uCutoff);
}
`;

export class FadeToBlackPostFxPipeline extends CustomPipeline {
  constructor(game: Phaser.Game) {
    super(game, frag);
  }
}
