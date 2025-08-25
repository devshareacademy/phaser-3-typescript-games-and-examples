import * as Phaser from 'phaser';

// The GLSL fragment shader code as a string.
// It uses two textures: the main sampler for the indexed image and a palette sampler for the colors.
const fragShader = `
precision mediump float;

// --- UNIFORMS ---
// These are the inputs from our Phaser code to the shader.

// The main texture, which is our grayscale indexed image.
uniform sampler2D uMainSampler;
// The palette texture, which is our 1D strip of colors.
uniform sampler2D uPaletteSampler;
// A time value that continuously increases, used for animation.
uniform float uTime;
// A multiplier to control the speed of the animation.
uniform float uCycleSpeed;
// The width of our palette texture, needed for correct mapping.
uniform float uPaletteWidth;

// --- VARYING ---
// This is the texture coordinate passed from the vertex shader.
varying vec2 outTexCoord;

void main(void) {
  // --- STEP 1: Check if the pixel is part of our image. ---
  // Sample the main texture. This texture contains the full screen with our image drawn on it.
  vec4 mainColor = texture2D(uMainSampler, outTexCoord);
  // gl_FragColor = vec4(mainColor.rgb, 1.0);

  // If the pixel's alpha is 0, it means it's outside our image.
  // We use 'discard' to tell the shader to stop processing and throw this pixel away,
  // leaving the scene background visible.
  if (mainColor.a == 0.0) {
    discard;
  }

  // --- STEP 2: Get the color index. ---
  // The red channel of our grayscale image holds the index value (from 0.0 to 1.0).
  float index = mainColor.r;

  // --- STEP 3: Animate the index. ---
  // a. Scale the index to the full width of the palette (e.g., 0.5 becomes 128 if width is 256).
  // b. Add the time, multiplied by speed, to shift the index over time.
  float animatedIndex = (index * uPaletteWidth) + (uTime * uCycleSpeed);

  // --- STEP 4: Wrap the index. ---
  // Use the modulo operator to make the index wrap around when it goes past the end of the palette.
  // This creates the seamless looping animation.
  float wrappedIndex = mod(animatedIndex, uPaletteWidth);

  // --- STEP 5: Look up the final color. ---
  // a. Normalize the wrapped index back to the 0.0-1.0 range for texture lookup.
  float paletteCoordinate = wrappedIndex / uPaletteWidth;
  // b. Sample the color from the palette texture at that coordinate.
  //    (The Y coordinate is 0.5 because our palette is a 1D texture in the middle of the image).
  vec4 finalColor = texture2D(uPaletteSampler, vec2(paletteCoordinate, 0.5));

  // --- STEP 6: Output the final color. ---
  // Set the pixel's color to the one we looked up from the palette, with full alpha.
  gl_FragColor = vec4(finalColor.rgb, 1.0);
}
`;

/**
 * A PostFX pipeline that applies a palette cycling effect.
 * This shader uses an indexed texture (the main texture) and a 1D color palette texture
 * to create an animated color cycling effect, similar to those in Earthbound.
 */
export class PaletteCyclePostFxPipeline extends Phaser.Renderer.WebGL.Pipelines.PostFXPipeline {
  /**
   * The speed of the palette cycling animation. Higher is faster.
   */
  #cycleSpeed: number = 50.0;

  /**
   * The width of the palette texture in pixels. This is set automatically when you call setPalette.
   */
  #paletteWidth: number = 256;

  /** The color palette texture used for coloring the grey scale image texture. */
  #paletteTexture: Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper | null = null;

  constructor(game: Phaser.Game) {
    super({
      game,
      fragShader,
    });
  }

  set cycleSpeed(val: number) {
    this.#cycleSpeed = val;
  }

  /**
   * Called before the pipeline is rendered. Sets the uniforms required by the shader.
   */
  public onPreRender(): void {
    // Update the time uniform on each frame. game.loop.time is a continuously increasing value in ms.
    this.set1f('uTime', this.game.loop.time / 1000); // Convert to seconds for more manageable speed values.
    this.set1f('uCycleSpeed', this.#cycleSpeed);
    this.set1f('uPaletteWidth', this.#paletteWidth);

    if (this.#paletteTexture) {
      // Bind the palette texture to texture unit 1.
      // uMainSampler (the indexed image) is automatically bound to unit 0 by Phaser.
      this.set1i('uPaletteSampler', 1);
    }
  }

  /**
   * Binds the the secondary texture to unit 1 channel, so we can draw this texture from the
   * frag shader code.
   */
  public onDraw(renderTarget: Phaser.Renderer.WebGL.RenderTarget): void {
    if (this.#paletteTexture !== null) {
      this.bindTexture(this.#paletteTexture, 1);
    }
    this.bindAndDraw(renderTarget);
  }

  /**
   * Sets the palette texture to be used for the color lookup.
   * @param {string} textureKey - The key of the palette texture in the Phaser Texture Manager.
   */
  public setPalette(textureKey: string): void {
    this.#paletteTexture = this.game.textures.getFrame(textureKey).glTexture;
    this.#paletteWidth = this.#paletteTexture.width;
  }
}
