import { SHADER_TEXTURE_ASSET_KEYS } from '../common';

const frag = `
#define SHADER_NAME WIPE_POST_FX

#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D uMainSampler;
// coordinate from the vertex shader
varying vec2 outTexCoord;
uniform float uCutoff;
uniform sampler2D uMainSampler2;

void main() {
  vec4 p = texture2D(uMainSampler2, outTexCoord);
  if (p.r < uCutoff) {
    gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
  } else {
    // returns the original color of the pixel that is being processed
    gl_FragColor = texture2D(uMainSampler, outTexCoord);
  }
}
`;

export class CustomPostFxPipeline extends Phaser.Renderer.WebGL.Pipelines.PostFXPipeline {
  #progress: number;
  #customTexture: Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper | null;

  constructor(game: Phaser.Game) {
    super({
      game,
      fragShader: frag,
    });
    this.#progress = 0;
    this.#customTexture = null;
  }

  get progress(): number {
    return this.#progress;
  }

  set progress(val: number) {
    this.#progress = val;
  }

  onBoot() {
    this.#customTexture = this.game.textures.get(SHADER_TEXTURE_ASSET_KEYS.TRIANGLE).source[0].glTexture;
    this.set1i('uMainSampler2', 1);
  }

  onPreRender() {
    this.set1f('uCutoff', this.#progress);
    if (this.#customTexture === null) {
      return;
    }
    this.bindTexture(this.#customTexture, 1);
  }
}
