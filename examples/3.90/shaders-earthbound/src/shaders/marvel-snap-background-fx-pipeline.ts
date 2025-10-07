import * as Phaser from 'phaser';

const fragShader = `
#define SHADER_NAME MARVEL_SNAP_BG_FX
precision mediump float;

uniform sampler2D uMainSampler;
uniform vec2 uMouse; // Mouse position from -1 to 1
uniform float uParallaxFactor; // How much the background should move

varying vec2 outTexCoord;

void main() {
    // The background image should be larger than the view area for parallax to work.
    // We shift the texture coordinates based on mouse position.
    vec2 parallaxOffset = uMouse * uParallaxFactor;
    vec2 uv = outTexCoord + parallaxOffset;

    gl_FragColor = texture2D(uMainSampler, uv);
}
`;

export class MarvelSnapBackgroundFX extends Phaser.Renderer.WebGL.Pipelines.PostFXPipeline {
  private _mouseX = 0;
  private _mouseY = 0;
  private _parallaxFactor = 0.05;

  constructor(game: Phaser.Game) {
    super({
      game,
      fragShader,
    });
  }

  onPreRender(): void {
    this.set2f('uMouse', this._mouseX, this._mouseY);
    this.set1f('uParallaxFactor', this._parallaxFactor);
  }

  get mouseX(): number {
    return this._mouseX;
  }
  set mouseX(value: number) {
    this._mouseX = value;
  }

  get mouseY(): number {
    return this._mouseY;
  }
  set mouseY(value: number) {
    this._mouseY = value;
  }

  get parallaxFactor(): number {
    return this._parallaxFactor;
  }
  set parallaxFactor(value: number) {
    this._parallaxFactor = value;
  }
}
