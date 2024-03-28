const frag = `
#define SHADER_NAME CURTAIN_FALL_POST_FX

#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D uMainSampler;
// coordinate from the vertex shader
varying vec2 outTexCoord;
uniform float uCutoff;

void main() {
  float dif = abs(1.0 - uCutoff);
  if (outTexCoord.y > dif) {
    gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
  } else {
    // returns the original color of the pixel that is being processed
    gl_FragColor = texture2D(uMainSampler, outTexCoord);
  }
}
`;

export class CurtainFallPostFxPipeline extends Phaser.Renderer.WebGL.Pipelines.PostFXPipeline {
  #progress: number;

  constructor(game: Phaser.Game) {
    super({
      game,
      fragShader: frag,
    });
    this.#progress = 0;
  }

  get progress(): number {
    return this.#progress;
  }

  set progress(val: number) {
    this.#progress = val;
  }

  onPreRender() {
    this.set1f('uCutoff', this.#progress);
  }
}
