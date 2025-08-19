import * as Phaser from 'phaser';

const fragShader = `
precision mediump float;

uniform sampler2D u_main;
uniform float u_time;
uniform vec2 u_resolution;
uniform float u_strength;
uniform float u_scrollSpeed;
uniform float u_curve;

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    float centerY = 0.5;

    // Compute vertical distance from center
    float dy = (uv.y - centerY);

    // Strength curve: bigger scale farther from center (cylinder effect)
    float scale = 1.0 + u_strength * pow(abs(dy), u_curve);

    // Horizonal UV remapped by inverse scale centered
    float centeredX = (uv.x - 0.5) / scale + 0.5;

    // Vertical scroll for motion
    float v = fract(uv.y + u_time * u_scrollSpeed);

    vec2 finalUV = vec2(centeredX, v);

    // sample texture
    vec4 color = texture2D(u_main, finalUV);
    gl_FragColor = color;
}
`;

export class ConcaveDistortionPostFxPipeline extends Phaser.Renderer.WebGL.Pipelines.PostFXPipeline {
  strength: number = 0.5;
  scrollSpeed: number = 0.2;
  curve: number = 2.0;

  constructor(game: Phaser.Game) {
    super({
      game,
      fragShader,
      name: 'ConcaveDistortionPostFxPipeline',
    });
  }

  onPreRender(): void {
    this.set1f('u_time', this.game.loop.time / 1000);
    this.set2f('u_resolution', this.renderer.width, this.renderer.height);
    this.set1f('u_strength', this.strength);
    this.set1f('u_scrollSpeed', this.scrollSpeed);
    this.set1f('u_curve', this.curve);
  }
}
