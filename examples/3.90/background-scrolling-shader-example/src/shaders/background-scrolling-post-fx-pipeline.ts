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
// A 2D vector to control the scroll speed and direction.
uniform vec2 u_speed;

// --- VARYING ---
// This is the texture coordinate passed from the vertex shader.
varying vec2 outTexCoord;

void main(void) {
  // It samples the texture at the original, unmodified texture coordinate.
  // gl_FragColor = texture2D(uMainSampler, outTexCoord);

  // Calculate the new texture coordinates by adding a time-based offset.
  vec2 scrolledCoords = outTexCoord + (u_time * u_speed);

  // Use fract() to wrap the coordinates, creating a seamless tiling effect.
  // This is equivalent to mod(scrolledCoords, 1.0).
  vec2 wrappedCoords = fract(scrolledCoords);

  // Sample the texture at the new, wrapped coordinates.
  gl_FragColor = texture2D(uMainSampler, wrappedCoords);
}
`;

/**
 * A PostFX pipeline that applies a background scrolling effect.
 */
export class BackgroundScrollingPostFxPipeline extends Phaser.Renderer.WebGL.Pipelines.PostFXPipeline {
  /**
   * A 2D vector controlling the speed and direction of the scroll.
   * X for horizontal speed, Y for vertical speed.
   * Positive values scroll right/down, negative values scroll left/up.
   */
  #speedX: number = 0.05;
  #speedY: number = 0.05;

  constructor(game: Phaser.Game) {
    super({
      game,
      fragShader,
    });
  }

  set speedX(val: number) {
    this.#speedX = val;
  }

  set speedY(val: number) {
    this.#speedY = val;
  }

  /**
   * Called before the pipeline is rendered. Sets the uniforms required by the shader.
   */
  public onPreRender(): void {
    // Update the time uniform on each frame. game.loop.time is a continuously increasing value in ms.
    this.set1f('u_time', this.game.loop.time / 1000); // Convert to seconds for more manageable speed values.
    this.set2f('u_speed', this.#speedX, this.#speedY);
  }
}
