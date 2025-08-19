import * as Phaser from 'phaser';

// The GLSL fragment shader for the scrolling effect.
const fragShader = `
precision mediump float;

// The main texture from the Game Object.
uniform sampler2D uMainSampler;
// A continuously increasing time value for animation.
uniform float uTime;
// A 2D vector to control the scroll speed and direction.
uniform vec2 uSpeed;

// The texture coordinate from the vertex shader.
varying vec2 outTexCoord;

void main() {
    // Calculate the new texture coordinates by adding a time-based offset.
    vec2 scrolledCoords = outTexCoord + (uTime * uSpeed);

    // Use fract() to wrap the coordinates, creating a seamless tiling effect.
    // This is equivalent to mod(scrolledCoords, 1.0).
    vec2 wrappedCoords = fract(scrolledCoords);

    // Sample the texture at the new, wrapped coordinates.
    gl_FragColor = texture2D(uMainSampler, wrappedCoords);
}
`;

/**
 * A PostFX pipeline that creates a continuous scrolling background effect.
 */
export class BackgroundScrollingPostFxPipeline extends Phaser.Renderer.WebGL.Pipelines.PostFXPipeline {
  /**
   * A 2D vector controlling the speed and direction of the scroll.
   * X for horizontal speed, Y for vertical speed.
   * Positive values scroll right/down, negative values scroll left/up.
   */
  speed: Phaser.Math.Vector2 = new Phaser.Math.Vector2(0.05, 0.05);

  constructor(game: Phaser.Game) {
    super({
      game,
      fragShader,
    });
  }

  /**
   * Called before the pipeline is rendered. Sets the uniforms required by the shader.
   */
  onPreRender(): void {
    // Update the time uniform on each frame.
    this.set1f('uTime', this.game.loop.time / 1000); // Use seconds for more manageable speed values.
    // Update the speed uniform.
    this.set2f('uSpeed', this.speed.x, this.speed.y);
  }
}
