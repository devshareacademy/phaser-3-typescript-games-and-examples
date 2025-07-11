import { CustomPipeline } from './custom-pipeline';
import { SHADER_ASSET_KEYS } from '../asset-key';

const frag = `
#define SHADER_NAME GRADIENT_TEXTURE_POST_FX

#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D uMainSampler;
// coordinate from the vertex shader
varying vec2 outTexCoord;
uniform float uCutoff;
// custom gradient texture
uniform sampler2D uGradientTexture;

void main() {
  float grad = texture2D(uGradientTexture, outTexCoord).r;
  if (grad < uCutoff) {
    gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
  } else {
    gl_FragColor = texture2D(uMainSampler, outTexCoord);
  }
}
`;

export class GradientTexturePostFxPipeline extends CustomPipeline {
  protected _gradientTexture!: Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper;

  constructor(game: Phaser.Game) {
    super(game, frag);
  }

  onBoot(): void {
    this.setTexture(SHADER_ASSET_KEYS.WIPE);
  }

  setTexture(key: string) {
    this._gradientTexture = this.game.textures.getFrame(key).glTexture;
  }

  onPreRender(): void {
    super.onPreRender();
    this.set1i('uGradientTexture', 1);
  }

  onDraw(renderTarget: Phaser.Renderer.WebGL.RenderTarget) {
    this.bindTexture(this._gradientTexture, 1);
    this.bindAndDraw(renderTarget);
  }
}
