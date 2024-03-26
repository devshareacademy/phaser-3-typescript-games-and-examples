const frag = `
#define SHADER_NAME NOTHING_POST_TINT

#ifdef GL_ES
precision mediump float;
#endif

// coordinate from the vertex shader
varying vec2 outTexCoord;
uniform sampler2D uMainSampler;

void main() {
  gl_FragColor = texture2D(uMainSampler, outTexCoord);
}
`;

export class NothingPostFxPipeline extends Phaser.Renderer.WebGL.Pipelines.PostFXPipeline {
  constructor(game: Phaser.Game) {
    super({
      game,
      fragShader: frag,
    });
  }
}
