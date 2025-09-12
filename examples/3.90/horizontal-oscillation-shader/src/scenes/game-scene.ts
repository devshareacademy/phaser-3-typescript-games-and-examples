import * as Phaser from 'phaser';
import { Pane } from 'tweakpane';
import { ASSET_KEYS, SCENE_KEYS } from '../common';
import { HorizontalOscillationPostFxPipeline } from '../shaders/horizontal-oscillation-post-fx-pipeline';

const PANE_SETTINGS = {
  background: 'texture_004',
  speed: 1.0,
  amplitude: 0.05,
  frequency: 20.0,
};

export class GameScene extends Phaser.Scene {
  #pane!: Pane;
  #bgImage!: Phaser.GameObjects.Image | Phaser.GameObjects.TileSprite;
  #pipeline!: HorizontalOscillationPostFxPipeline;
  #sineWaveGraphics!: Phaser.GameObjects.Graphics;

  constructor() {
    super({ key: SCENE_KEYS.GAME_SCENE });
  }

  public create(): void {
    this.#setupPipelines();
    this.#createMainBg();
    this.#createDemoVisuals();
    this.#createPane();
  }

  public update(): void {
    this.#drawSineWave();
  }

  /**
   * Adds the new custom shader pipeline to the Phaser Renderer so we can use
   * this pipeline on our game objects.
   */
  #setupPipelines(): void {
    const renderer = this.renderer as Phaser.Renderer.WebGL.WebGLRenderer;
    if (!renderer.pipelines.get(HorizontalOscillationPostFxPipeline.name)) {
      renderer.pipelines.addPostPipeline(HorizontalOscillationPostFxPipeline.name, HorizontalOscillationPostFxPipeline);
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
      .setPostPipeline(HorizontalOscillationPostFxPipeline.name);

    this.#pipeline = this.#bgImage.getPostPipeline(
      HorizontalOscillationPostFxPipeline.name,
    ) as HorizontalOscillationPostFxPipeline;
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
      .addBinding(PANE_SETTINGS, 'speed', {
        min: 0,
        max: 10,
        step: 1,
        label: 'Speed',
      })
      .on('change', (ev) => {
        if (this.#pipeline) {
          this.#pipeline.speed = ev.value;
        }
      });

    this.#pane
      .addBinding(PANE_SETTINGS, 'amplitude', {
        min: 0,
        max: 1,
        step: 0.01,
        label: 'Amplitude',
      })
      .on('change', (ev) => {
        if (this.#pipeline) {
          this.#pipeline.amplitude = ev.value;
        }
      });

    this.#pane
      .addBinding(PANE_SETTINGS, 'frequency', {
        min: 10,
        max: 30,
        step: 1,
        label: 'Frequency',
      })
      .on('change', (ev) => {
        if (this.#pipeline) {
          this.#pipeline.frequency = ev.value;
        }
      });
  }

  #createDemoVisuals(): void {
    const centerX = this.cameras.main.width / 2;
    const startY = 50;

    this.add
      .text(centerX, startY, 'Horizontal Oscillation', {
        fontSize: '24px',
        fontFamily: '"Arial Black", Gadget, sans-serif',
      })
      .setOrigin(0.5);

    this.#sineWaveGraphics = this.add.graphics();
  }

  #drawSineWave(): void {
    this.#sineWaveGraphics.clear();
    this.#sineWaveGraphics.lineStyle(2, 0xffffff, 0.8);

    const path = new Phaser.Curves.Path();

    const height = this.cameras.main.height;
    const centerX = 100;
    const time = this.game.loop.time / 1000;

    const drawingAmplitude = PANE_SETTINGS.amplitude * 200;

    for (let y = 0; y <= height; y++) {
      const texCoordY = y / height;
      const wave = Math.sin(texCoordY * PANE_SETTINGS.frequency + time * PANE_SETTINGS.speed);
      const offset = wave * drawingAmplitude;

      if (y === 0) {
        path.moveTo(centerX + offset, y);
      } else {
        path.lineTo(centerX + offset, y);
      }
    }

    path.draw(this.#sineWaveGraphics);
  }
}
