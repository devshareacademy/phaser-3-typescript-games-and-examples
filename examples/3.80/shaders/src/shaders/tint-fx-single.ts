const frag = `
#define SHADER_NAME TINT

#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D uMainSampler;
varying vec2 outTexCoord;
varying float outTexId;

void main() {
  vec4 texture = texture2D(uMainSampler, outTexCoord);
  gl_FragColor = texture;
  float gray = dot(texture.rgb, vec3(0.299, 0.587, 0.114));
  gl_FragColor = vec4(vec3(gray), 1.0);
}
`;

export class TintFx extends Phaser.Renderer.WebGL.Pipelines.SinglePipeline {
  constructor(game: Phaser.Game) {
    super({
      game,
      name: 'TintFx',
      renderTarget: true,
      fragShader: frag,
    });
  }
}
