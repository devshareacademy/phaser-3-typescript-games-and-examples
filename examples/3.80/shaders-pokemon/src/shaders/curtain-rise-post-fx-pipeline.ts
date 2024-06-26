import { CustomPipeline } from './custom-pipeline';

const frag = `
#define SHADER_NAME CURTAIN_RISE_POST_FX

#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D uMainSampler;
// coordinate from the vertex shader
varying vec2 outTexCoord;
uniform float uCutoff;

void main() {
  if (outTexCoord.y > uCutoff) {
    gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
  } else {
    // returns the original color of the pixel that is being processed
    gl_FragColor = texture2D(uMainSampler, outTexCoord);
  }
}
`;

export class CurtainRisePostFxPipeline extends CustomPipeline {
  constructor(game: Phaser.Game) {
    super(game, frag);
    this._progress = 1;
  }
}
