import * as Phaser from 'phaser';

export class PaletteCyclingController extends Phaser.Filters.Controller {
  /**
   * The speed of the palette cycling animation. Higher is faster.
   */
  #cycleSpeed: number = 50.0;

  /**
   * The width of the palette texture in pixels. This is set automatically when you call setPalette.
   */
  #paletteWidth: number = 256;

  /** The grey scale image texture to use. */
  #greyScaleTexture: Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper | null = null;

  /** The color palette texture used for coloring the grey scale image texture. */
  #paletteTexture: Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper | null = null;

  /**
   * The amount of time that has passed since the game was started.
   */
  #time: number = 0;

  constructor(camera: Phaser.Cameras.Scene2D.Camera) {
    super(camera, 'PaletteCycling');
  }

  get cycleSpeed(): number {
    return this.#cycleSpeed;
  }

  set cycleSpeed(val: number) {
    this.#cycleSpeed = val;
  }

  get paletteWidth(): number {
    return this.#paletteWidth;
  }

  get paletteTexture(): Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper | null {
    return this.#paletteTexture;
  }

  get greyScaleTexture(): Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper | null {
    return this.#greyScaleTexture;
  }

  get time(): number {
    return this.#time;
  }

  set time(val: number) {
    this.#time = val;
  }

  /**
   * Sets the palette texture to be used for the color lookup.
   * @param {string} textureKey - The key of the palette texture in the Phaser Texture Manager.
   */
  public setPalette(textureKey: string): void {
    const phaserTexture = this.camera.scene.sys.textures.getFrame(textureKey);
    if (phaserTexture) {
      this.#paletteTexture = phaserTexture.glTexture;
      this.#paletteWidth = this.#paletteTexture.width;
    }
  }

  /**
   * Sets the grey scale texture to be used.
   * @param {string} textureKey - The key of the palette texture in the Phaser Texture Manager.
   */
  public setGreyScaleTexture(textureKey: string): void {
    const phaserTexture = this.camera.scene.sys.textures.getFrame(textureKey);
    if (phaserTexture) {
      this.#greyScaleTexture = phaserTexture.glTexture;
    }
  }
}

export class PaletteCyclingShader extends Phaser.Renderer.WebGL.RenderNodes.BaseFilterShader {
  constructor(manager: Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager) {
    super('PaletteCycling', manager, 'palette_cycling');
  }

  public setupTextures(
    controller: PaletteCyclingController,
    textures: Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper[],
  ) {
    if (controller.paletteTexture) {
      textures[1] = controller.paletteTexture;
    }
    if (controller.greyScaleTexture) {
      textures[2] = controller.greyScaleTexture;
    }
  }

  public setupUniforms(controller: PaletteCyclingController) {
    const programManager = this.programManager;
    programManager.setUniform('uCycleSpeed', controller.cycleSpeed);
    programManager.setUniform('uPaletteWidth', controller.paletteWidth);
    programManager.setUniform('uPaletteSampler', 1);
    programManager.setUniform('uGreyScaleSampler', 2);
    programManager.setUniform('uTime', controller.time);
  }
}
