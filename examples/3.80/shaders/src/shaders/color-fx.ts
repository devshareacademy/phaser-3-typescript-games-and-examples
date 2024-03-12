const frag = `
#define SHADER_NAME COLOR

#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D uMainSampler;
// coordinate from the vertex shader
varying vec2 outTexCoord;

void main() {
  gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
}
`;

export class ColorFx extends Phaser.Renderer.WebGL.Pipelines.MultiPipeline {
  constructor(game: Phaser.Game) {
    super({
      game,
      fragShader: frag,
    });
  }
}

// need to fix
