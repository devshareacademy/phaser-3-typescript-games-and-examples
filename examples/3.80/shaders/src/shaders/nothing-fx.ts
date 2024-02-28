const frag = `
#define SHADER_NAME NOTHING

#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D uMainSampler;
// coordinate from the vertex shader
varying vec2 outTexCoord;

void main() {
  gl_FragColor = texture2D(uMainSampler, outTexCoord);
}
`;

export class NothingFx extends Phaser.Renderer.WebGL.Pipelines.MultiPipeline {
  constructor(game: Phaser.Game) {
    super({
      game,
      renderTarget: true,
      fragShader: frag,
    });
  }
}
