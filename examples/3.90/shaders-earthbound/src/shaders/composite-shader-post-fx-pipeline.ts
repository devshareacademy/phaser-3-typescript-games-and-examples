import * as Phaser from 'phaser';

// The GLSL fragment shader for the scrolling effect.
const fragShader = `
precision mediump float;

// The main texture from the Game Object.
uniform sampler2D uMainSampler;

uniform sampler2D uLayer1;
uniform sampler2D uLayer2;

uniform float uAlpha;

// The texture coordinate from the vertex shader.
varying vec2 outTexCoord;

void main() {
  vec4 color1 = texture2D(uLayer1, outTexCoord);
  vec4 color2 = texture2D(uLayer2, outTexCoord);

  vec4 finalColor = mix(color1, color2, uAlpha);

  gl_FragColor = finalColor;
}
`;

/**
 * A PostFX pipeline that creates a continuous scrolling background effect.
 */
export class CompositeShaderPostFxPipeline extends Phaser.Renderer.WebGL.Pipelines.PostFXPipeline {
  public alpha = 0.3;
  protected _textureLayer1!: Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper;
  protected _textureLayer2!: Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper;

  constructor(game: Phaser.Game) {
    super({
      game,
      fragShader,
    });
  }

  set textureLayer1(texture: Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper) {
    this._textureLayer1 = texture;
  }

  set textureLayer2(texture: Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper) {
    this._textureLayer2 = texture;
  }

  onPreRender(): void {
    super.onPreRender();
    this.set1i('uLayer1', 1);
    this.set1i('uLayer2', 2);
    this.set1f('uAlpha', this.alpha);
  }

  onDraw(renderTarget: Phaser.Renderer.WebGL.RenderTarget) {
    if (this._textureLayer1 && this._textureLayer2) {
      this.bindTexture(this._textureLayer1, 1);
      this.bindTexture(this._textureLayer2, 2);
      this.bindAndDraw(renderTarget);
      return;
    }

    this.bindAndDraw(renderTarget);
  }
}
