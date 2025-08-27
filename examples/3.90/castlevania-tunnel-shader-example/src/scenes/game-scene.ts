import * as Phaser from 'phaser';
import { Pane } from 'tweakpane';
import { ASSET_KEYS, SCENE_KEYS } from '../common';
import { ConcaveDistortionPostFxPipeline } from '../shaders/concave-distortion-post-fx-pipeline';

export class GameScene extends Phaser.Scene {
  #pane!: Pane;
  #bgImage!: Phaser.GameObjects.Image | Phaser.GameObjects.TileSprite;
  #pipeline!: ConcaveDistortionPostFxPipeline;
  #cursorKeys!: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor() {
    super({ key: SCENE_KEYS.GAME_SCENE });
  }

  public create(): void {
    if (!this.input.keyboard) {
      return;
    }

    this.#setupPipelines();
    this.#createMainBg();
    this.#createPane();

    this.#cursorKeys = this.input.keyboard.createCursorKeys();
  }

  /**
   * Adds the new custom shader pipeline to the Phaser Renderer so we can use
   * this pipeline on our game objects.
   */
  #setupPipelines(): void {
    const renderer = this.renderer as Phaser.Renderer.WebGL.WebGLRenderer;
    if (!renderer.pipelines.get(ConcaveDistortionPostFxPipeline.name)) {
      renderer.pipelines.addPostPipeline(ConcaveDistortionPostFxPipeline.name, ConcaveDistortionPostFxPipeline);
    }
  }

  /**
   * Creates the main background image which the shader will be applied to.
   */
  #createMainBg(): void {
    // tunnel image
    this.#bgImage = this.add
      .image(this.cameras.main.width / 2, this.cameras.main.height / 2, ASSET_KEYS.TUNNEL)
      .setScale(2);

    // grid image
    // this.#bgImage = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, ASSET_KEYS.GRID);
    // this.#bgImage.setDisplaySize(this.#bgImage.width, this.cameras.main.height);

    this.#bgImage.setPostPipeline(ConcaveDistortionPostFxPipeline.name);

    this.#pipeline = this.#bgImage.getPostPipeline(
      ConcaveDistortionPostFxPipeline.name,
    ) as ConcaveDistortionPostFxPipeline;
  }

  /**
   * Setup the tweak pane configuration, which allows for the dynamic controls
   * for modifying the shader values for things like speed and the textures being
   * used.
   */
  #createPane(): void {
    this.#pane = new Pane({ title: 'Concave Distortion Controls' });
    this.#pane.addBinding(this.#pipeline, 'strength', {
      min: 0,
      max: 5,
      step: 0.01,
      label: 'Strength',
    });

    this.#pane.addBinding(this.#pipeline, 'scrollSpeed', {
      min: -1,
      max: 1,
      step: 0.01,
      label: 'Scroll Speed',
    });

    this.#pane.addBinding(this.#pipeline, 'curve', {
      min: 1.0,
      max: 5.0,
      step: 0.1,
      label: 'Curve',
    });
  }
}
