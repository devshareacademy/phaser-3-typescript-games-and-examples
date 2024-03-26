const frag = `
#define SHADER_NAME GREY_SCALE_POST_TINT

#ifdef GL_ES
precision mediump float;
#endif

// coordinate from the vertex shader
varying vec2 outTexCoord;
uniform sampler2D uMainSampler;

void main() {
  gl_FragColor = texture2D(uMainSampler, outTexCoord);
  // mix https://thebookofshaders.com/glossary/?search=mix
  gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(0.2126 * gl_FragColor.r + 0.7152 * gl_FragColor.g + 0.0722 * gl_FragColor.b), 1.0);
}
`;

export class GreyScalePostFxPipeline extends Phaser.Renderer.WebGL.Pipelines.PostFXPipeline {
  constructor(game: Phaser.Game) {
    super({
      game,
      fragShader: frag,
    });
  }
}
