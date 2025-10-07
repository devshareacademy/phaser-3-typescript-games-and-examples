import * as Phaser from 'phaser';

const fragShader = `
precision mediump float;

uniform sampler2D uMainSampler;
uniform float uTime;

// Uniforms
uniform vec4 uLightningColor;
uniform float uSize;
uniform float uWidth;
uniform float uSpeed;
uniform float uCycle;
uniform float uRatio;
uniform float uTimeShift;
uniform float uX; // Horizontal position

varying vec2 outTexCoord;

const float PI = 3.14159265359;

float rand(float x){
	return fract(sin(x)*100000.0);
}

void main() {
    float bolt = abs(mod(outTexCoord.y * uCycle + (rand(uTime) + uTimeShift * 10.0) * uSpeed * -1., 0.5)-0.25)-0.125;
    bolt *= 4. * uWidth;

    bolt *=  (0.5 - abs(outTexCoord.y-0.5)) * 2.;

    float wave = abs(outTexCoord.x - uX + bolt);
    wave = 1. - step(uSize*.5, wave);

    float blink = step(rand(uTime + 1.0)*uRatio, .5);
    wave *= blink;

    vec4 display = uLightningColor * vec4(wave);

    gl_FragColor = display;
}
`;

export class LightningPostFxPipeline extends Phaser.Renderer.WebGL.Pipelines.PostFXPipeline {
  // Uniforms
  lightningColor = new Phaser.Math.Vector4(0.84, 0.85, 0.16, 1.0);
  size = 0.003;
  width = 0.04;
  speed = 0.2;
  cycle = 5.0;
  ratio = 0.0;
  timeShift = 0.0;
  x = 0.5; // Horizontal position

  constructor(game: Phaser.Game) {
    super({
      game,
      fragShader,
    });
  }

  onPreRender() {
    this.set1f('uTime', this.game.loop.time / 1000);
    this.set4f(
      'uLightningColor',
      this.lightningColor.x,
      this.lightningColor.y,
      this.lightningColor.z,
      this.lightningColor.w,
    );
    this.set1f('uSize', this.size);
    this.set1f('uWidth', this.width);
    this.set1f('uSpeed', this.speed);
    this.set1f('uCycle', this.cycle);
    this.set1f('uRatio', this.ratio);
    this.set1f('uTimeShift', this.timeShift);
    this.set1f('uX', this.x);
  }
}
