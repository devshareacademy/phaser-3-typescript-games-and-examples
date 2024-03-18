const frag = `
#define SHADER_NAME TINT

#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D uMainSampler[%count%];
uniform float gray;

varying vec2 outTexCoord;
varying float outTexId;
varying vec4 outTint;
varying vec2 fragCoord;

void main() {
  vec4 texture;

  %forloop%

  gl_FragColor = texture;
  // gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(0.2126 * gl_FragColor.r + 0.7152 * gl_FragColor.g + 0.0722 * gl_FragColor.b), 1.0);
  float gray = dot(texture.rgb, vec3(0.299, 0.587, 0.114));
  gl_FragColor = vec4(vec3(gray), 1.0);
}
`;

export class TintFx extends Phaser.Renderer.WebGL.Pipelines.MultiPipeline {
  constructor(game: Phaser.Game) {
    super({
      game,
      fragShader: frag,
    });
  }
}
