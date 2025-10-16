import * as Phaser from 'phaser';
import { Pane } from 'tweakpane';
import { ASSET_KEYS, SCENE_KEYS } from '../common';
import { BackgroundScrollingPostFxPipeline } from '../shaders/background-scrolling-post-fx-pipeline';

const PANE_SETTINGS = {
  background: 'texture_102_m',
  speedX: 0.05,
  speedY: 0.05,
};

export class GameScene extends Phaser.Scene {
  #pane!: Pane;
  #bgImage!: Phaser.GameObjects.Image | Phaser.GameObjects.TileSprite;
  #pipeline!: BackgroundScrollingPostFxPipeline;

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
    if (!renderer.pipelines.get(BackgroundScrollingPostFxPipeline.name)) {
      renderer.pipelines.addPostPipeline(BackgroundScrollingPostFxPipeline.name, BackgroundScrollingPostFxPipeline);
    }
  }

  /**
   * Creates the main background image which the shader will be applied to.
   */
  #createMainBg(): void {
    this.#bgImage = this.add
      .image(0, 0, PANE_SETTINGS.background)
      .setDisplaySize(this.cameras.main.width, this.cameras.main.height)
      .setOrigin(0)
      .setPostPipeline(BackgroundScrollingPostFxPipeline.name);

    this.#pipeline = this.#bgImage.getPostPipeline(
      BackgroundScrollingPostFxPipeline.name,
    ) as BackgroundScrollingPostFxPipeline;
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
      .addBinding(PANE_SETTINGS, 'speedX', {
        min: -0.5,
        max: 0.5,
        step: 0.01,
        label: 'Speed X',
      })
      .on('change', (ev) => {
        if (this.#pipeline) {
          this.#pipeline.speedX = ev.value;
        }
      });

    this.#pane
      .addBinding(PANE_SETTINGS, 'speedY', {
        min: -0.5,
        max: 0.5,
        step: 0.01,
        label: 'Speed Y',
      })
      .on('change', (ev) => {
        if (this.#pipeline) {
          this.#pipeline.speedY = ev.value;
        }
      });
  }

  #createDemoVisuals(): void {
    const centerX = this.cameras.main.width / 2;
    const startY = 50;

    this.add
      .text(centerX, startY, 'Background Scrolling', {
        fontSize: '24px',
        fontFamily: '"Arial Black", Gadget, sans-serif',
      })
      .setOrigin(0.5);
  }
}
