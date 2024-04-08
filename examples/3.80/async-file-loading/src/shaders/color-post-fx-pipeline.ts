const frag = `
#define SHADER_NAME COLOR_POST_TINT

#ifdef GL_ES
precision mediump float;
#endif

void main() {
  // RGB, Alpha
  gl_FragColor = vec4(0.0, 0.0, 0.0, 0.2);
}
`;

export class ColorPostFxPipeline extends Phaser.Renderer.WebGL.Pipelines.PostFXPipeline {
  constructor(game: Phaser.Game) {
    super({
      game,
      fragShader: frag,
    });
  }
}
