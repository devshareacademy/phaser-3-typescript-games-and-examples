import * as Phaser from 'phaser';

const vertShader = `
precision mediump float;

// Default PostFX attributes
attribute vec2 inPosition;
attribute vec2 inTexCoord;

uniform mat4 uProjectionMatrix;

// Custom uniforms
uniform float uTime;
uniform float uDisplacementStrength;
uniform float uCapeWaveStrength;

uniform sampler2D uDisplacement;
uniform sampler2D uCapeMask;
uniform sampler2D uNoise;

varying vec2 outTexCoord;

void main() {
    outTexCoord = inTexCoord;
    // The normal for a 2D plane mesh is constant
    vec3 normal = vec3(0.0, 0.0, 1.0);

    // 1. Static Displacement for 3D effect
    // Sample displacement map (grayscale, 0.5 is no displacement)
    float displacement = (texture2D(uDisplacement, inTexCoord).r - 0.5) * uDisplacementStrength;

    // 2. Cape Animation
    // Scroll noise texture over time
    vec2 noiseUV = vec2(inTexCoord.x, inTexCoord.y + uTime * 0.1);
    float noise = (texture2D(uNoise, noiseUV).r - 0.5) * 2.0; // Noise from -1 to 1

    // Get cape mask
    float mask = texture2D(uCapeMask, inTexCoord).r;

    // Apply waving displacement only to the cape
    float capeDisplacement = noise * mask * uCapeWaveStrength;

    // 3. Combine displacements and apply to vertex position
    vec3 finalPosition = vec3(inPosition, 0.0) + normal * (displacement + capeDisplacement);

    gl_Position = uProjectionMatrix * vec4(finalPosition.xy, 0.0, 1.0);
}
`;

const fragShader = `
precision mediump float;

uniform sampler2D uMainSampler;
varying vec2 outTexCoord;

void main() {
    gl_FragColor = texture2D(uMainSampler, outTexCoord);
}
`;

export class MarvelSnapHeroFX extends Phaser.Renderer.WebGL.Pipelines.PostFXPipeline {
  private _time = 0;
  private _displacementStrength = 0.05;
  private _capeWaveStrength = 0.1;

  // Texture units
  private displacementTexture: WebGLTexture | null = null;
  private capeMaskTexture: WebGLTexture | null = null;
  private noiseTexture: WebGLTexture | null = null;

  constructor(game: Phaser.Game) {
    super({
      game,
      fragShader,
      vertShader,
    });
  }

  onBoot(): void {
    const renderer = this.game.renderer as Phaser.Renderer.WebGL.WebGLRenderer;
    this.displacementTexture = renderer.getTexture('supes_displacement')?.source[0].glTexture ?? null;
    this.capeMaskTexture = renderer.getTexture('supes_cape_mask')?.source[0].glTexture ?? null;
    this.noiseTexture = renderer.getTexture('noise')?.source[0].glTexture ?? null;
  }

  onPreRender(): void {
    if (!this.displacementTexture || !this.capeMaskTexture || !this.noiseTexture) {
      return;
    }

    this.set1f('uTime', this._time);
    this.set1f('uDisplacementStrength', this._displacementStrength);
    this.set1f('uCapeWaveStrength', this._capeWaveStrength);

    // Bind additional textures
    const renderer = this.game.renderer as Phaser.Renderer.WebGL.WebGLRenderer;

    renderer.gl.activeTexture(renderer.gl.TEXTURE1);
    renderer.gl.bindTexture(renderer.gl.TEXTURE_2D, this.displacementTexture);
    this.set1i('uDisplacement', 1);

    renderer.gl.activeTexture(renderer.gl.TEXTURE2);
    renderer.gl.bindTexture(renderer.gl.TEXTURE_2D, this.capeMaskTexture);
    this.set1i('uCapeMask', 2);

    renderer.gl.activeTexture(renderer.gl.TEXTURE3);
    renderer.gl.bindTexture(renderer.gl.TEXTURE_2D, this.noiseTexture);
    this.set1i('uNoise', 3);

    // Reset to texture unit 0
    renderer.gl.activeTexture(renderer.gl.TEXTURE0);
  }

  get time(): number {
    return this._time;
  }
  set time(value: number) {
    this._time = value;
  }

  get displacementStrength(): number {
    return this._displacementStrength;
  }
  set displacementStrength(value: number) {
    this._displacementStrength = value;
  }

  get capeWaveStrength(): number {
    return this._capeWaveStrength;
  }
  set capeWaveStrength(value: number) {
    this._capeWaveStrength = value;
  }
}
