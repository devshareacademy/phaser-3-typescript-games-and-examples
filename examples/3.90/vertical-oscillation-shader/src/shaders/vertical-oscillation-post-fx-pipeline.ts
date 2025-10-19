import * as Phaser from 'phaser';

// The GLSL fragment shader code as a string.
const fragShader = `
precision mediump float;

// --- UNIFORMS ---
// These are the inputs from our Phaser code to the shader.

// The main texture
uniform sampler2D uMainSampler;
// A time value that continuously increases, used for animation.
uniform float u_time;
// A multiplier to control the speed of the animation.
uniform float u_speed;
// controls the size of the sine wave
uniform float u_amplitude;
uniform float u_frequency;

// --- VARYING ---
// This is the texture coordinate passed from the vertex shader.
varying vec2 outTexCoord;

void main(void) {
  // It samples the texture at the original, unmodified texture coordinate.
  gl_FragColor = texture2D(uMainSampler, outTexCoord);

  // Create a sine wave that varies along the horizontal (x) axis of the texture.
  // - outTexCoord.x: The horizontal position of the current pixel.
  // - u_frequency: Controls how many wave cycles appear horizontally.
  // - u_time * u_speed: Animates the wave over time.
  float wave = sin(outTexCoord.x * u_frequency + u_time * u_speed);

  // Calculate the vertical offset for the current pixel.
  // - wave: The sine wave value (-1.0 to 1.0).
  // - u_amplitude: Controls the maximum distance the pixels are pushed up or down.
  float offset = wave * u_amplitude;

  // Create a new texture coordinate by applying the vertical offset.
  // The horizontal coordinate remains unchanged.
  vec2 newCoords = vec2(outTexCoord.x, outTexCoord.y + offset);

  // Sample the texture again, but this time using the new, displaced coordinate.
  // This creates the final wavy, oscillating effect.
  gl_FragColor = texture2D(uMainSampler, newCoords);
}
`;

/**
 * A PostFX pipeline that applies a vertical effect.
 */
export class VerticalOscillationPostFxPipeline extends Phaser.Renderer.WebGL.Pipelines.PostFXPipeline {
  /**
   * The speed of the animation. Higher is faster.
   */
  #speed: number = 1.0;

  /**
   * The amplitude (height) of the sine wave that is created.
   */
  #amplitude: number = 0.05;

  /**
   * The frequency (length or number of cycles) of the sine wave that is created.
   */
  #frequency: number = 20.0;

  constructor(game: Phaser.Game) {
    super({
      game,
      fragShader,
    });
  }

  set speed(val: number) {
    this.#speed = val;
  }

  set amplitude(val: number) {
    this.#amplitude = val;
  }

  set frequency(val: number) {
    this.#frequency = val;
  }

  /**
   * Called before the pipeline is rendered. Sets the uniforms required by the shader.
   */
  public onPreRender(): void {
    // Update the time uniform on each frame. game.loop.time is a continuously increasing value in ms.
    this.set1f('u_time', this.game.loop.time / 1000); // Convert to seconds for more manageable speed values.
    this.set1f('u_speed', this.#speed);
    this.set1f('u_amplitude', this.#amplitude);
    this.set1f('u_frequency', this.#frequency);
  }
}
