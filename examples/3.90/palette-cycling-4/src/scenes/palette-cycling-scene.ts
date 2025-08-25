import * as Phaser from 'phaser';
import { Pane } from 'tweakpane';
import { ASSET_KEYS, SCENE_KEYS } from '../common';
import { PaletteCyclingController, PaletteCyclingShader } from '../shaders/palette-cycling-shader';

const PANE_SETTINGS = {
  background: 'indexed_posterized',
  palette: 'palette_fire',
  cycleSpeed: 50.0,
};

export class PaletteCyclingScene extends Phaser.Scene {
  #pane!: Pane;
  #bgImage!: Phaser.GameObjects.Image;
  #mainBg!: Phaser.GameObjects.Rectangle;
  #paletteCyclingController!: PaletteCyclingController;
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
    if (this.#paletteTileSprite && this.#paletteCyclingController) {
      const speed = PANE_SETTINGS.cycleSpeed;
      this.#paletteTileSprite.tilePositionX += (delta / 1000) * speed;
      this.#paletteCyclingController.cycleSpeed = speed;
      this.#paletteCyclingController.time = this.game.loop.time / 1000;
    }
  }

  /**
   * Adds the new custom shader pipeline to the Phaser Renderer so we can use
   * this pipeline on our game objects.
   */
  #setupPipelines(): void {
    const renderer = this.renderer as Phaser.Renderer.WebGL.WebGLRenderer;
    if (!renderer.renderNodes.hasNode('PaletteCycling')) {
      renderer.renderNodes.addNodeConstructor('PaletteCycling', PaletteCyclingShader);
    }
  }

  /**
   * Creates the main background image which the shader will be applied to.
   */
  #createMainBg(): void {
    this.#mainBg = this.add
      .rectangle(0, 0, this.scale.width, this.scale.height, 0x00ff00, 1.0)
      .enableFilters()
      .setOrigin(0);

    // define the filter controller that will be used for the game object
    this.#paletteCyclingController = new PaletteCyclingController(this.#mainBg.filterCamera);
    this.#paletteCyclingController.setPalette(PANE_SETTINGS.palette);
    this.#paletteCyclingController.setGreyScaleTexture(PANE_SETTINGS.background);
    // add the controller to the filter for the shader to be applied
    this.#mainBg.filters?.external.add(this.#paletteCyclingController);
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
        if (this.#paletteCyclingController) {
          this.#paletteCyclingController.setGreyScaleTexture(ev.value);
        }
      });

    this.#pane
      .addBinding(PANE_SETTINGS, 'palette', {
        view: 'list',
        label: 'Palette',
        options: Object.keys(ASSET_KEYS.palettes).map((key) => ({ text: key, value: key })),
      })
      .on('change', (ev) => {
        this.#paletteCyclingController.setPalette(ev.value);
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

    this.add.rectangle(centerX, startY, this.scale.width / 2, startY, 0x000000, 1);
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
