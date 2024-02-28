const frag = `
#define SHADER_NAME TINT

#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D uMainSampler;
// coordinate from the vertex shader
varying vec2 outTexCoord;

void main() {
  vec4 color = texture2D(uMainSampler, outTexCoord);
  float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
  gl_FragColor = vec4(vec3(gray), 1.0);
}
`;

export class TintFx extends Phaser.Renderer.WebGL.Pipelines.MultiPipeline {
  constructor(game: Phaser.Game) {
    super({
      game,
      renderTarget: true,
      fragShader: frag,
    });
  }
}
