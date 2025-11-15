import * as Phaser from 'phaser';

// The GLSL fragment shader code as a string.
const fragShader = `
precision mediump float;

// --- UNIFORMS ---
// These are the inputs from our Phaser code to the shader.

// The main texture
uniform sampler2D uMainSampler;

// The two textures we are passing to the shader
uniform sampler2D uLayer1;
uniform sampler2D uLayer2;

// --- VARYING ---
// This is the texture coordinate passed from the vertex shader.
varying vec2 outTexCoord;

// The opacity value applied when we mix the two textures.
uniform float uAlpha;

void main(void) {
  // It samples the texture at the original, unmodified texture coordinate.
  gl_FragColor = texture2D(uMainSampler, outTexCoord);

  // sample the same coordinate from both textures
  vec4 color1 = texture2D(uLayer1, outTexCoord);
  vec4 color2 = texture2D(uLayer2, outTexCoord);

  // mix the two colors together based on the alpha uniform provided
  vec4 finalColor = mix(color1, color2, uAlpha);

  // render out the final mixed color
  gl_FragColor = finalColor;
}
`;

/**
 * A PostFX pipeline that applies a transparency effect.
 */
export class TransparencyPostFxPipeline extends Phaser.Renderer.WebGL.Pipelines.PostFXPipeline {
  /** The amount of opacity to apply to the 2nd texture when rendering out both textures. */
  #alpha: number = 0.0;

  /** The 1st texture used for the final effect. */
  #textureLayer1: Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper | undefined;

  /** The 2nd texture used for the final effect. */
  #textureLayer2: Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper | undefined;

  constructor(game: Phaser.Game) {
    super({
      game,
      fragShader,
    });
  }

  set alpha(val: number) {
    this.#alpha = val;
  }

  set textureLayer1(textureKey: string) {
    this.#textureLayer1 = this.game.textures.getFrame(textureKey).glTexture;
  }

  set textureLayer2(textureKey: string) {
    this.#textureLayer2 = this.game.textures.getFrame(textureKey).glTexture;
  }

  set textureLayer1GLTexture(webGLTexture: Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper) {
    this.#textureLayer1 = webGLTexture;
  }

  set textureLayer2GLTexture(webGLTexture: Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper) {
    this.#textureLayer2 = webGLTexture;
  }

  /**
   * Called before the pipeline is rendered. Sets the uniforms required by the shader.
   */
  public onPreRender(): void {
    super.onPreRender();
    this.set1i('uLayer1', 1);
    this.set1i('uLayer2', 2);
    this.set1f('uAlpha', this.#alpha);
  }

  /**
   * Binds the the textures to unit 1 and 2 channels, so we can draw this texture from the
   * frag shader code.
   */
  public onDraw(renderTarget: Phaser.Renderer.WebGL.RenderTarget) {
    if (this.#textureLayer1 && this.#textureLayer2) {
      this.bindTexture(this.#textureLayer1, 1);
      this.bindTexture(this.#textureLayer2, 2);
      this.bindAndDraw(renderTarget);
      return;
    }

    this.bindAndDraw(renderTarget);
  }
}
