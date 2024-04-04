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

void main() {
  vec4 color = texture2D(uMainSampler, outTexCoord);
  color.rgb = color.rgb * (1.0 - uCutoff);
  gl_FragColor = color;
}
`;

export class FadeToBlackPostFxPipeline extends CustomPipeline {
  constructor(game: Phaser.Game) {
    super(game, frag);
  }
}
