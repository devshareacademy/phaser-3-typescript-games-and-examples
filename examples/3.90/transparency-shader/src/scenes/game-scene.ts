import * as Phaser from 'phaser';
import { Pane } from 'tweakpane';
import { ASSET_KEYS, SCENE_KEYS } from '../common';
import { TransparencyPostFxPipeline } from '../shaders/transparency-post-fx-pipeline';

const PANE_SETTINGS = {
  background1: 'texture_004',
  background2: 'texture_102',
  alpha: 0.0,
};

export class GameScene extends Phaser.Scene {
  #pane!: Pane;
  #bgImage!: Phaser.GameObjects.Image | Phaser.GameObjects.TileSprite;
  #pipeline!: TransparencyPostFxPipeline;

  constructor() {
    super({ key: SCENE_KEYS.GAME_SCENE });
  }

  public create(): void {
    this.#setupPipelines();
    this.#createMainBg();
    this.#createDemoVisuals();
    this.#createPane();
  }

  /**
   * Adds the new custom shader pipeline to the Phaser Renderer so we can use
   * this pipeline on our game objects.
   */
  #setupPipelines(): void {
    const renderer = this.renderer as Phaser.Renderer.WebGL.WebGLRenderer;
    if (!renderer.pipelines.get(TransparencyPostFxPipeline.name)) {
      renderer.pipelines.addPostPipeline(TransparencyPostFxPipeline.name, TransparencyPostFxPipeline);
    }
  }

  /**
   * Creates the main background image which the shader will be applied to.
   */
  #createMainBg(): void {
    this.#bgImage = this.add
      .image(0, 0, PANE_SETTINGS.background1)
      .setDisplaySize(this.cameras.main.width, this.cameras.main.height)
      .setOrigin(0)
      .setPostPipeline(TransparencyPostFxPipeline.name);

    this.#pipeline = this.#bgImage.getPostPipeline(TransparencyPostFxPipeline.name) as TransparencyPostFxPipeline;
    this.#pipeline.textureLayer1 = PANE_SETTINGS.background1;
    this.#pipeline.textureLayer2 = PANE_SETTINGS.background2;
  }

  /**
   * Setup the tweak pane configuration, which allows for the dynamic controls
   * for modifying the shader values for things like speed and the textures being
   * used.
   */
  #createPane(): void {
    this.#pane = new Pane({ title: 'Shader Controls' });
    this.#pane
      .addBinding(PANE_SETTINGS, 'background1', {
        view: 'list',
        label: 'Background 1',
        options: Object.keys(ASSET_KEYS.indexed).map((key) => ({ text: key, value: key })),
      })
      .on('change', (ev) => {
        if (this.#pipeline) {
          this.#pipeline.textureLayer1 = ev.value;
        }
      });

    this.#pane
      .addBinding(PANE_SETTINGS, 'background2', {
        view: 'list',
        label: 'Background 2',
        options: Object.keys(ASSET_KEYS.indexed).map((key) => ({ text: key, value: key })),
      })
      .on('change', (ev) => {
        if (this.#pipeline) {
          this.#pipeline.textureLayer2 = ev.value;
        }
      });

    this.#pane
      .addBinding(PANE_SETTINGS, 'alpha', {
        min: 0.0,
        max: 1.0,
        step: 0.01,
        label: 'Alpha',
      })
      .on('change', (ev) => {
        if (this.#pipeline) {
          this.#pipeline.alpha = ev.value;
        }
      });
  }

  #createDemoVisuals(): void {
    const centerX = this.cameras.main.width / 2;
    const startY = 50;

    this.add
      .text(centerX, startY, 'Transparency', {
        fontSize: '24px',
        fontFamily: '"Arial Black", Gadget, sans-serif',
      })
      .setOrigin(0.5);
  }
}
