import * as Phaser from 'phaser';

const fragShader = `
precision mediump float;

uniform sampler2D uMainSampler;
uniform float uTime;

// Horizontal wave uniforms
uniform float uSpeedX;
uniform float uAmplitudeX;
uniform float uFrequencyX;

// Vertical wave uniforms
uniform float uSpeedY;
uniform float uAmplitudeY;
uniform float uFrequencyY;

varying vec2 outTexCoord;

void main() {
  // Calculate horizontal displacement
  float waveX = sin(outTexCoord.y * uFrequencyX + uTime * uSpeedX);
  float offsetX = waveX * uAmplitudeX;

  // Calculate vertical displacement
  float waveY = sin(outTexCoord.x * uFrequencyY + uTime * uSpeedY);
  float offsetY = waveY * uAmplitudeY;

  // Apply both offsets
  vec2 newCoords = vec2(outTexCoord.x + offsetX, outTexCoord.y + offsetY);

  gl_FragColor = texture2D(uMainSampler, newCoords);
}
`;

export class InterleavedOscillationPostFxPipeline extends Phaser.Renderer.WebGL.Pipelines.PostFXPipeline {
  // Horizontal wave properties
  speedX: number = 5;
  amplitudeX: number = 0.01;
  frequencyX: number = 25;

  // Vertical wave properties
  speedY: number = 5;
  amplitudeY: number = 0.01;
  frequencyY: number = 25;

  constructor(game: Phaser.Game) {
    super({
      game,
      fragShader,
    });
  }

  /**
   * Called before the pipeline is rendered. Sets the uniforms required by the shader.
   */
  public onPreRender(): void {
    this.set1f('uTime', this.game.loop.time / 1000);

    // Set horizontal uniforms
    this.set1f('uSpeedX', this.speedX);
    this.set1f('uAmplitudeX', this.amplitudeX);
    this.set1f('uFrequencyX', this.frequencyX);

    // Set vertical uniforms
    this.set1f('uSpeedY', this.speedY);
    this.set1f('uAmplitudeY', this.amplitudeY);
    this.set1f('uFrequencyY', this.frequencyY);
  }
}
