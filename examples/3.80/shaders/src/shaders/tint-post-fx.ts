const frag = `
#define SHADER_NAME TINT_POST

#ifdef GL_ES
precision mediump float;
#endif

// [%count%] is added by phaser to set number of samplers available
// needed otherwise some object might not be rendered when using multiple
// pipelines
// example, uncomment the following line and we will see the character object get removed
uniform sampler2D uMainSampler;
// uniform sampler2D uMainSampler[%count%];
// coordinate from the vertex shader
varying vec2 outTexCoord;

void main() {
  gl_FragColor = texture2D(uMainSampler, outTexCoord);
  // vec4 color = texture2D(uMainSampler, outTexCoord);
  // float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
  // gl_FragColor = vec4(vec3(gray), 1.0);
}
`;

export class TintPostFx extends Phaser.Renderer.WebGL.Pipelines.PostFXPipeline {
  constructor(game: Phaser.Game) {
    super({
      game,
      name: 'TintPostFx',
      renderTarget: true,
      // fragShader: (game.cache.shader.get('tint') as Phaser.Display.BaseShader).fragmentSrc,
      fragShader: frag,
    });
  }
}
