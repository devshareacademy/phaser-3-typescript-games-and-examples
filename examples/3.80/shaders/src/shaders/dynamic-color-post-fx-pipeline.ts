const frag = `
#define SHADER_NAME DYNAMIC_POST_TINT

#ifdef GL_ES
precision mediump float;
#endif

varying vec2 outTexCoord;
uniform sampler2D uMainSampler;
uniform float uTest;

void main() {
  gl_FragColor = vec4(uTest, 0.4, 0.723, 1.0);
}
`;

export class DynamicColorPostFxPipeline extends Phaser.Renderer.WebGL.Pipelines.PostFXPipeline {
  #progress: number;

  constructor(game: Phaser.Game) {
    super({
      game,
      fragShader: frag,
    });
    this.#progress = 0.0;
  }

  get progress(): number {
    return this.#progress;
  }

  set progress(val: number) {
    this.#progress = val;
  }

  onPreRender(): void {
    this.set1f('uTest', this.#progress);
  }
}
