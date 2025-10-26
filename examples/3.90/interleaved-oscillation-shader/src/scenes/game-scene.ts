import * as Phaser from 'phaser';
import { Pane } from 'tweakpane';
import { ASSET_KEYS, SCENE_KEYS } from '../common';
import { InterleavedOscillationPostFxPipeline } from '../shaders/interleaved-oscillation-post-fx-pipeline';

const PANE_SETTINGS = {
  background: 'texture_004',
  // Horizontal wave properties
  speedX: 5.0,
  amplitudeX: 0.01,
  frequencyX: 25.0,
  // Vertical wave properties
  speedY: 5.0,
  amplitudeY: 0.01,
  frequencyY: 25.0,
};

export class GameScene extends Phaser.Scene {
  #pane!: Pane;
  #bgImage!: Phaser.GameObjects.Image | Phaser.GameObjects.TileSprite;
  #pipeline!: InterleavedOscillationPostFxPipeline;
  #sineWaveGraphicsForVertical!: Phaser.GameObjects.Graphics;
  #sineWaveGraphicsForHorizontal!: Phaser.GameObjects.Graphics;

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
    this.#drawSineWaveForVerticalOscillation();
    this.#drawSineWaveForHorizontalOscillation();
  }

  /**
   * Adds the new custom shader pipeline to the Phaser Renderer so we can use
   * this pipeline on our game objects.
   */
  #setupPipelines(): void {
    const renderer = this.renderer as Phaser.Renderer.WebGL.WebGLRenderer;
    if (!renderer.pipelines.get(InterleavedOscillationPostFxPipeline.name)) {
      renderer.pipelines.addPostPipeline(InterleavedOscillationPostFxPipeline.name, InterleavedOscillationPostFxPipeline);
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
      .setPostPipeline(InterleavedOscillationPostFxPipeline.name);

    this.#pipeline = this.#bgImage.getPostPipeline(
      InterleavedOscillationPostFxPipeline.name,
    ) as InterleavedOscillationPostFxPipeline;

    // Set initial values
    this.#pipeline.speedX = PANE_SETTINGS.speedX;
    this.#pipeline.amplitudeX = PANE_SETTINGS.amplitudeX;
    this.#pipeline.frequencyX = PANE_SETTINGS.frequencyX;
    this.#pipeline.speedY = PANE_SETTINGS.speedY;
    this.#pipeline.amplitudeY = PANE_SETTINGS.amplitudeY;
    this.#pipeline.frequencyY = PANE_SETTINGS.frequencyY;
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

    const horizontalFolder = this.#pane.addFolder({ title: 'Horizontal Wave' });
    horizontalFolder
      .addBinding(PANE_SETTINGS, 'speedX', {
        min: 0,
        max: 10,
        step: 1,
        label: 'Speed',
      })
      .on('change', (ev) => {
        if (this.#pipeline) {
          this.#pipeline.speedX = ev.value;
        }
      });

    horizontalFolder
      .addBinding(PANE_SETTINGS, 'amplitudeX', {
        min: 0,
        max: 0.1,
        step: 0.001,
        label: 'Amplitude',
      })
      .on('change', (ev) => {
        if (this.#pipeline) {
          this.#pipeline.amplitudeX = ev.value;
        }
      });

    horizontalFolder
      .addBinding(PANE_SETTINGS, 'frequencyX', {
        min: 10,
        max: 50,
        step: 1,
        label: 'Frequency',
      })
      .on('change', (ev) => {
        if (this.#pipeline) {
          this.#pipeline.frequencyX = ev.value;
        }
      });

    const verticalFolder = this.#pane.addFolder({ title: 'Vertical Wave' });
    verticalFolder
      .addBinding(PANE_SETTINGS, 'speedY', {
        min: 0,
        max: 10,
        step: 1,
        label: 'Speed',
      })
      .on('change', (ev) => {
        if (this.#pipeline) {
          this.#pipeline.speedY = ev.value;
        }
      });

    verticalFolder
      .addBinding(PANE_SETTINGS, 'amplitudeY', {
        min: 0,
        max: 0.1,
        step: 0.001,
        label: 'Amplitude',
      })
      .on('change', (ev) => {
        if (this.#pipeline) {
          this.#pipeline.amplitudeY = ev.value;
        }
      });

    verticalFolder
      .addBinding(PANE_SETTINGS, 'frequencyY', {
        min: 10,
        max: 50,
        step: 1,
        label: 'Frequency',
      })
      .on('change', (ev) => {
        if (this.#pipeline) {
          this.#pipeline.frequencyY = ev.value;
        }
      });
  }

  #createDemoVisuals(): void {
    const centerX = this.cameras.main.width / 2;
    const startY = 50;

    this.add
      .text(centerX, startY, 'Interleaved Oscillation', {
        fontSize: '24px',
        fontFamily: '"Arial Black", Gadget, sans-serif',
      })
      .setOrigin(0.5);

    this.#sineWaveGraphicsForVertical = this.add.graphics();
    this.#sineWaveGraphicsForHorizontal = this.add.graphics();
  }

  #drawSineWaveForVerticalOscillation(): void {
    this.#sineWaveGraphicsForVertical.clear();
    this.#sineWaveGraphicsForVertical.lineStyle(2, 0xffffff, 0.8);

    const path = new Phaser.Curves.Path();

    const width = this.cameras.main.width;
    const centerY = 100;
    const time = this.game.loop.time / 1000;

    const drawingAmplitude = PANE_SETTINGS.amplitudeY * 500; // Increased multiplier for visibility

    for (let x = 0; x <= width; x++) {
      const texCoordX = x / width;
      const wave = Math.sin(texCoordX * PANE_SETTINGS.frequencyY + time * PANE_SETTINGS.speedY);
      const offset = wave * drawingAmplitude;

      if (x === 0) {
        path.moveTo(x, centerY + offset);
      } else {
        path.lineTo(x, centerY + offset);
      }
    }

    path.draw(this.#sineWaveGraphicsForVertical);
  }

  #drawSineWaveForHorizontalOscillation(): void {
    this.#sineWaveGraphicsForHorizontal.clear();
    this.#sineWaveGraphicsForHorizontal.lineStyle(2, 0xffffff, 0.8);

    const path = new Phaser.Curves.Path();

    const height = this.cameras.main.height;
    const centerX = 100;
    const time = this.game.loop.time / 1000;

    const drawingAmplitude = PANE_SETTINGS.amplitudeX * 500; // Increased multiplier for visibility

    for (let y = 0; y <= height; y++) {
      const texCoordY = y / height;
      const wave = Math.sin(texCoordY * PANE_SETTINGS.frequencyX + time * PANE_SETTINGS.speedX);
      const offset = wave * drawingAmplitude;

      if (y === 0) {
        path.moveTo(centerX + offset, y);
      } else {
        path.lineTo(centerX + offset, y);
      }
    }

    path.draw(this.#sineWaveGraphicsForHorizontal);
  }
}
