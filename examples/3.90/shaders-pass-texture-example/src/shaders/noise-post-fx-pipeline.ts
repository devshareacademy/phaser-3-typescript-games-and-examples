const frag = `
#define SHADER_NAME NOISE_POST_FX

#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D uMainSampler;
// coordinate from the vertex shader
varying vec2 outTexCoord;
// custom gradient texture
uniform sampler2D uNoise;
// for scaling the texture
uniform float uScale;
// for blending the texture
uniform float uBlend;

void main() {
  vec4 base = texture2D(uMainSampler, outTexCoord);
  vec4 noise = texture2D(uNoise, outTexCoord * uScale);
  gl_FragColor = mix(base, noise, uBlend);
}
`;

export class NoisePostFxPipeline extends Phaser.Renderer.WebGL.Pipelines.PostFXPipeline {
  protected _gradientTexture!: Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper;
  protected _scale: number;
  protected _blend: number;

  constructor(game: Phaser.Game) {
    super({ game, fragShader: frag });
    this._scale = 2.0;
    this._blend = 0.15;
  }

  get scale(): number {
    return this._scale;
  }

  set scale(val: number) {
    this._scale = val;
  }

  get blend(): number {
    return this._blend;
  }

  set blend(val: number) {
    this._blend = val;
  }

  onBoot(): void {
    this._gradientTexture = this.game.textures.getFrame('NOISE').glTexture;
  }

  onPreRender(): void {
    super.onPreRender();
    this.set1i('uNoise', 1);
    this.set1f('uScale', this._scale);
    this.set1f('uBlend', this._blend);
  }

  onDraw(renderTarget: Phaser.Renderer.WebGL.RenderTarget) {
    this.bindTexture(this._gradientTexture, 1);
    this.bindAndDraw(renderTarget);
  }
}
