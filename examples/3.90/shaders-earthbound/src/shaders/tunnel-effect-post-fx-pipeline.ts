import * as Phaser from 'phaser';

const fragShader = `
#define PI 3.1415926535897932384626433832795

precision mediump float;

uniform sampler2D uMainSampler;
uniform float uTime;
uniform vec2 uResolution;
uniform float uSpin;
uniform float uSpeed;

varying vec2 outTexCoord;

void main() {


    vec2 uv = outTexCoord;
    vec2 centered_uv = uv - 0.5;
    centered_uv.x *= uResolution.x / uResolution.y;

    float radius = length(centered_uv);
    float angle = atan(centered_uv.y, centered_uv.x);

    // Use max() to prevent division by a number too close to zero.
    float v = (1.0 / max(radius, 0.01)) + uTime * uSpeed;
    float u = angle / (2.0 * PI) + uTime * uSpin;

    vec2 new_uv = vec2(u, v);

    // Use fract() to ensure the texture coordinates wrap correctly,
    // creating the seamless repeating tunnel effect.
    vec2 wrapped_uv = fract(new_uv);

    gl_FragColor = texture2D(uMainSampler, wrapped_uv);
    //gl_FragColor = texture2D(uMainSampler, outTexCoord);
}


`;

export class TunnelEffectPostFxPipeline extends Phaser.Renderer.WebGL.Pipelines.PostFXPipeline {
  spin: number = 0.1;
  speed: number = 0.2;

  constructor(game: Phaser.Game) {
    super({
      game,
      fragShader,
    });
  }

  onPreRender(): void {
    this.set1f('uTime', this.game.loop.time / 1000);
    this.set2f('uResolution', this.renderer.width, this.renderer.height);
    this.set1f('uSpin', this.spin);
    this.set1f('uSpeed', this.speed);
  }
}
