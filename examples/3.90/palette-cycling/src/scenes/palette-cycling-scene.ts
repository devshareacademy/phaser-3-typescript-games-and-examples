import * as Phaser from 'phaser';
import { Pane } from 'tweakpane';
import { ASSET_KEYS, SCENE_KEYS } from '../common';
import { PaletteCyclePostFxPipeline } from '../shaders/palette-cycle-post-fx-pipeline';

const PANE_SETTINGS = {
  background: 'indexed_posterized',
  palette: 'palette_fire',
  cycleSpeed: 50.0,
};

export class PaletteCyclingScene extends Phaser.Scene {
  #pane!: Pane;
  #bgImage!: Phaser.GameObjects.Image | Phaser.GameObjects.TileSprite;
  #palettePipeline!: PaletteCyclePostFxPipeline;
  #paletteTileSprite!: Phaser.GameObjects.TileSprite;

  constructor() {
    super({ key: SCENE_KEYS.PALETTE_CYCLING_SCENE });
  }

  public create(): void {
    this.#setupPipelines();
    this.#createMainBg();
    this.#createDemoVisuals();
    this.#createPane();
  }

  public update(time: number, delta: number): void {
    if (this.#paletteTileSprite && this.#palettePipeline) {
      const speed = PANE_SETTINGS.cycleSpeed;
      this.#paletteTileSprite.tilePositionX += (delta / 1000) * speed;
      this.#palettePipeline.cycleSpeed = speed;
    }
  }

  /**
   * Adds the new custom shader pipeline to the Phaser Renderer so we can use
   * this pipeline on our game objects.
   */
  #setupPipelines(): void {
    const renderer = this.renderer as Phaser.Renderer.WebGL.WebGLRenderer;
    if (!renderer.pipelines.get(PaletteCyclePostFxPipeline.name)) {
      renderer.pipelines.addPostPipeline(PaletteCyclePostFxPipeline.name, PaletteCyclePostFxPipeline);
    }
  }

  /**
   * Creates the main background image which the shader will be applied to.
   */
  #createMainBg(): void {
    this.#bgImage = this.add
      .image(this.cameras.main.width / 2, this.cameras.main.height / 2 + 70, PANE_SETTINGS.background)
      .setScale(1.5)
      .setPostPipeline(PaletteCyclePostFxPipeline.name);

    this.#palettePipeline = this.#bgImage.getPostPipeline(
      PaletteCyclePostFxPipeline.name,
    ) as PaletteCyclePostFxPipeline;
    this.#palettePipeline.setPalette(PANE_SETTINGS.palette);
  }

  /**
   * Setup the tweak pane configuration, which allows for the dynamic controls
   * for modifying the shader values for things like speed and the textures being
   * used.
   */
  #createPane(): void {
    this.#pane = new Pane({ title: 'Shader Controls' });
    this.#pane
      .addBinding(PANE_SETTINGS, 'background', {
        view: 'list',
        label: 'Background',
        options: Object.keys(ASSET_KEYS.indexed).map((key) => ({ text: key, value: key })),
      })
      .on('change', (ev) => {
        if (this.#bgImage) {
          this.#bgImage.setTexture(ev.value);
        }
      });

    this.#pane
      .addBinding(PANE_SETTINGS, 'palette', {
        view: 'list',
        label: 'Palette',
        options: Object.keys(ASSET_KEYS.palettes).map((key) => ({ text: key, value: key })),
      })
      .on('change', (ev) => {
        this.#palettePipeline.setPalette(ev.value);
        this.#paletteTileSprite.setTexture(ev.value);
      });

    this.#pane.addBinding(PANE_SETTINGS, 'cycleSpeed', {
      min: 0,
      max: 200,
      step: 1,
      label: 'Cycle Speed',
    });
  }

  /**
   * Example demo of how the palette cycling works by shifting the colors in the color
   * palette array by their index over time.
   */
  #createDemoVisuals(): void {
    const centerX = this.cameras.main.width / 2;
    const startY = 50;

    this.add
      .text(centerX, startY, 'Palette Cycling', {
        fontSize: '24px',
        fontFamily: '"Arial Black", Gadget, sans-serif',
      })
      .setOrigin(0.5);

    const paletteTexture = this.textures.get(PANE_SETTINGS.palette);
    const paletteWidth = paletteTexture.source[0].width;
    const visHeight = 24;

    this.#paletteTileSprite = this.add.tileSprite(centerX, startY + 50, paletteWidth, visHeight, PANE_SETTINGS.palette);
  }
}
