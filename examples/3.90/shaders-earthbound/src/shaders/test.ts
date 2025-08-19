const frag = `
#define SHADER_NAME PALETTE_CYCLE_POST_FX

#ifdef GL_ES
precision mediump float;
#endif

// coordinate from the vertex shader
varying vec2 outTexCoord;

uniform sampler2D uIndexTex;
uniform sampler2D uPaletteTex;
uniform float uTime;
uniform float uSpeed;

void main() {
  // Get the index (grayscale 0–1)
  float idx = texture2D(uIndexTex, outTexCoord).r;

  // Compute palette offset based on speed and time
  float offset = mod(uTime * uSpeed, 1.0);

  // Sample the palette with offset
  vec3 color = texture2D(uPaletteTex, vec2(fract(idx + offset), 0.0)).rgb;
  gl_FragColor = vec4(color, 1.0);

  //float idx = texture2D(uIndexTex, outTexCoord).r;
  //gl_FragColor = vec4(vec3(idx), 1.0); // Grayscale output
}
`;

export class PaletteCyclePreFxPipeline extends Phaser.Renderer.WebGL.Pipelines.PreFXPipeline {
  protected _indexTexture!: Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper;
  protected _paletteTexture!: Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper;
  protected _time: number;
  protected _speed: number;

  constructor(game: Phaser.Game) {
    super({ game, fragShader: frag });
    this._time = 0.0;
    this._speed = 0.1;
  }

  get speed(): number {
    return this._speed;
  }

  set speed(val: number) {
    this._speed = val;
  }

  get time(): number {
    return this._time;
  }

  set time(val: number) {
    this._time = val;
  }

  onBind() {
    super.onBind();
    this._indexTexture = this.game.textures.getFrame('INDEX_TEXTURE_ASSET_KEY').glTexture;
    this._paletteTexture = this.game.textures.getFrame('PALETTE_TEXTURE_ASSET_KEY').glTexture;
  }

  onPreRender(): void {
    super.onPreRender();
    this.set1i('uIndexTex', 1);
    this.set1i('uPaletteTex', 2);
    this.set1f('uTime', this._time);
    this.set1f('uSpeed', this._speed);
  }

  onDraw(renderTarget: Phaser.Renderer.WebGL.RenderTarget) {
    this.bindTexture(this._indexTexture, 1);
    this.bindTexture(this._paletteTexture, 2);
    this.drawToGame(renderTarget);
  }
}

const frag2 = `
#define SHADER_NAME PALETTE_CYCLE_POST_FX

#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D uMainSampler;
// coordinate from the vertex shader
varying vec2 outTexCoord;

uniform sampler2D uIndexTex;
uniform sampler2D uPaletteTex;
uniform float uTime;
uniform float uSpeed;

void main() {
  float idx = texture2D(uIndexTex, outTexCoord).r;
  float shifted = fract(idx + uTime * uSpeed);
  vec3 color = texture2D(uPaletteTex, vec2(shifted, 0.0)).rgb;
  gl_FragColor = vec4(color, 1.0);
  // gl_FragColor = texture2D(uMainSampler, outTexCoord); // for testing original texture
}
`;

export class PaletteCyclePostFxPipeline extends Phaser.Renderer.WebGL.Pipelines.PostFXPipeline {
  protected _indexTexture!: Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper;
  protected _paletteTexture!: Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper;
  protected _time: number;
  protected _speed: number;

  constructor(game: Phaser.Game) {
    super({ game, fragShader: frag2 });
    this._time = 0.0;
    this._speed = 0.1;
  }

  get speed(): number {
    return this._speed;
  }

  set speed(val: number) {
    this._speed = val;
  }

  get time(): number {
    return this._time;
  }

  set time(val: number) {
    this._time = val;
  }

  onBoot(): void {
    this._indexTexture = this.game.textures.getFrame('INDEX_TEXTURE_ASSET_KEY').glTexture;
    this._paletteTexture = this.game.textures.getFrame('PALETTE_TEXTURE_ASSET_KEY').glTexture;
  }

  onPreRender(): void {
    super.onPreRender();
    this.set1i('uIndexTex', 1);
    this.set1i('uPaletteTex', 2);
    this.set1f('uTime', this._time);
    this.set1f('uSpeed', this._speed);
  }

  onDraw(renderTarget: Phaser.Renderer.WebGL.RenderTarget) {
    this.bindTexture(this._indexTexture, 1);
    this.bindTexture(this._paletteTexture, 2);
    this.bindAndDraw(renderTarget);
  }
}
