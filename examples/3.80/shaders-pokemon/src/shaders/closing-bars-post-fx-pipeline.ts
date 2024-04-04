import { CustomPipeline } from './custom-pipeline';

const frag = `
#define SHADER_NAME CLOSING_BARS_POST_FX

#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D uMainSampler;
// coordinate from the vertex shader
varying vec2 outTexCoord;
uniform float uCutoff;

void main() {
  if (abs(outTexCoord.y - 0.5) * 2.0 > (1.0 - uCutoff)) {
    gl_FragColor = vec4(0, 0, 0, 1);
  } else {
    gl_FragColor = texture2D(uMainSampler, outTexCoord);
  }
}
`;

export class ClosingBarsPostFxPipeline extends CustomPipeline {
  constructor(game: Phaser.Game) {
    super(game, frag);
  }
}
