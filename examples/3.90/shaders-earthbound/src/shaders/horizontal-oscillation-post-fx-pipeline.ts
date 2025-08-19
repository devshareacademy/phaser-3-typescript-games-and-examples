import * as Phaser from 'phaser';

const fragShader = `
precision mediump float;

uniform sampler2D uMainSampler;
uniform float uTime;
uniform float uSpeed;
uniform float uAmplitude;
uniform float uFrequency;

varying vec2 outTexCoord;

void main() {
    float wave = sin(outTexCoord.y * uFrequency + uTime * uSpeed);
    float offset = wave * uAmplitude;
    vec2 newCoords = vec2(outTexCoord.x + offset, outTexCoord.y);
    gl_FragColor = texture2D(uMainSampler, newCoords);
}
`;

export class HorizontalOscillationPostFxPipeline extends Phaser.Renderer.WebGL.Pipelines.PostFXPipeline {
  speed: number = 5;
  amplitude: number = 0.01;
  frequency: number = 25;

  constructor(game: Phaser.Game) {
    super({
      game,
      fragShader,
    });
  }

  onPreRender(): void {
    this.set1f('uTime', this.game.loop.time / 1000);
    this.set1f('uSpeed', this.speed);
    this.set1f('uAmplitude', this.amplitude);
    this.set1f('uFrequency', this.frequency);
  }
}
