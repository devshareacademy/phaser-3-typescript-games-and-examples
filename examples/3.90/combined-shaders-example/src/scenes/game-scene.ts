import * as Phaser from 'phaser';
import { Pane } from 'tweakpane';
import { ASSET_KEYS, SCENE_KEYS } from '../common';
import { TransparencyPostFxPipeline } from '../shaders/transparency-post-fx-pipeline';
import { HorizontalOscillationPostFxPipeline } from '../shaders/horizontal-oscillation-post-fx-pipeline';
import { VerticalOscillationPostFxPipeline } from '../shaders/vertical-oscillation-post-fx-pipeline';
import { InterleavedOscillationPostFxPipeline } from '../shaders/interleaved-oscillation-post-fx-pipeline';
import { BackgroundScrollingPostFxPipeline } from '../shaders/background-scrolling-post-fx-pipeline';
import { PaletteCyclePostFxPipeline } from '../shaders/palette-cycle-post-fx-pipeline';

const PANE_SETTINGS = {
  background1: 'texture_004',
  background2: 'texture_001',
  alpha: 0.0,
  bg1Pipelines: {
    [HorizontalOscillationPostFxPipeline.name]: true,
    [VerticalOscillationPostFxPipeline.name]: false,
    [InterleavedOscillationPostFxPipeline.name]: false,
    [BackgroundScrollingPostFxPipeline.name]: false,
    [PaletteCyclePostFxPipeline.name]: false,
  },
  bg2Pipelines: {
    [HorizontalOscillationPostFxPipeline.name]: false,
    [VerticalOscillationPostFxPipeline.name]: true,
    [InterleavedOscillationPostFxPipeline.name]: false,
    [BackgroundScrollingPostFxPipeline.name]: true,
    [PaletteCyclePostFxPipeline.name]: false,
  },
  bg1PaletteCycle: {
    enabled: false,
    gradient: 'gradient_linear',
    palette: 'palette_fire',
  },
  bg2PaletteCycle: {
    enabled: false,
    gradient: 'gradient_radial',
    palette: 'palette_rainbow',
  },
};

export class GameScene extends Phaser.Scene {
  #pane!: Pane;
  #pipelineOptions!: { name: string; pipeline: unknown }[];

  // game objects needed to support render textures
  #bgImage1!: Phaser.GameObjects.Image;
  #bgImage2!: Phaser.GameObjects.Image;
  #rt1!: Phaser.GameObjects.RenderTexture;
  #rt2!: Phaser.GameObjects.RenderTexture;
  #finalBackground!: Phaser.GameObjects.Rectangle;
  #finalBackgroundPipeline!: TransparencyPostFxPipeline;

  constructor() {
    super({ key: SCENE_KEYS.GAME_SCENE });
  }

  public create(): void {
    this.#setupPipelines();
    this.#createRenderTextures();
    this.#createDecorations();
    this.#createPane();
  }

  public update(): void {
    if (!this.#rt1 || !this.#rt2) {
      return;
    }

    // clear render textures
    this.#rt1.clear();
    this.#rt2.clear();

    // draw background 1 with custom shaders into rt1
    this.#rt1.draw(this.#bgImage1);

    // draw background 2 with custom shaders into rt2
    this.#rt2.draw(this.#bgImage2);

    // update custom pipeline
    if (this.#rt1.texture.source[0].glTexture && this.#rt2.texture.source[0].glTexture) {
      this.#finalBackgroundPipeline.textureLayer1GLTexture = this.#rt1.texture.source[0].glTexture;
      this.#finalBackgroundPipeline.textureLayer2GLTexture = this.#rt2.texture.source[0].glTexture;
    }
  }

  /**
   * Adds the new custom shader pipeline to the Phaser Renderer so we can use
   * this pipeline on our game objects.
   */
  #setupPipelines(): void {
    const renderer = this.renderer as Phaser.Renderer.WebGL.WebGLRenderer;

    this.#pipelineOptions = [
      { name: HorizontalOscillationPostFxPipeline.name, pipeline: HorizontalOscillationPostFxPipeline },
      { name: VerticalOscillationPostFxPipeline.name, pipeline: VerticalOscillationPostFxPipeline },
      { name: InterleavedOscillationPostFxPipeline.name, pipeline: InterleavedOscillationPostFxPipeline },
      { name: BackgroundScrollingPostFxPipeline.name, pipeline: BackgroundScrollingPostFxPipeline },
      { name: PaletteCyclePostFxPipeline.name, pipeline: PaletteCyclePostFxPipeline },
    ];

    this.#pipelineOptions.forEach(({ name, pipeline }) => {
      if (!renderer.pipelines.get(name)) {
        renderer.pipelines.addPostPipeline(name, pipeline as () => undefined);
      }
    });

    if (!renderer.pipelines.get(TransparencyPostFxPipeline.name)) {
      renderer.pipelines.addPostPipeline(TransparencyPostFxPipeline.name, TransparencyPostFxPipeline);
    }
  }

  /**
   * Setup the tweak pane configuration, which allows for the dynamic controls
   * for modifying the shader values for things like speed and the textures being
   * used.
   */
  #createPane(): void {
    this.#pane = new Pane({ title: 'Battle Scene Controls' });

    const bgOptions = Object.keys(ASSET_KEYS.backgrounds).map((key) => ({ text: key, value: key }));
    const gradientOptions = Object.keys(ASSET_KEYS.gradients).map((key) => ({ text: key, value: key }));
    const paletteOptions = Object.keys(ASSET_KEYS.palettes).map((key) => ({ text: key, value: key }));

    // --- Background 1 Controls ---
    const bg1Folder = this.#pane.addFolder({ title: 'Background 1' });

    const bg1TextureBinding = bg1Folder
      .addBinding(PANE_SETTINGS, 'background1', {
        label: 'Texture',
        options: bgOptions,
        hidden: PANE_SETTINGS.bg1PaletteCycle.enabled,
      })
      .on('change', (ev) => {
        this.#bgImage1.setTexture(ev.value);
      });

    const bg1GradientBinding = bg1Folder
      .addBinding(PANE_SETTINGS.bg1PaletteCycle, 'gradient', {
        label: 'Gradient',
        options: gradientOptions,
        hidden: !PANE_SETTINGS.bg1PaletteCycle.enabled,
      })
      .on('change', (ev) => {
        this.#bgImage1.setTexture(ev.value);
      });

    const bg1PaletteBinding = bg1Folder
      .addBinding(PANE_SETTINGS.bg1PaletteCycle, 'palette', {
        label: 'Palette',
        options: paletteOptions,
        hidden: !PANE_SETTINGS.bg1PaletteCycle.enabled,
      })
      .on('change', (ev) => {
        const pipeline = this.#bgImage1.getPostPipeline(PaletteCyclePostFxPipeline.name) as PaletteCyclePostFxPipeline;
        if (pipeline) {
          pipeline.setPalette(ev.value);
        }
      });

    bg1Folder.addBinding(PANE_SETTINGS.bg1PaletteCycle, 'enabled', { label: 'Palette Cycle' }).on('change', (ev) => {
      bg1TextureBinding.hidden = ev.value;
      bg1GradientBinding.hidden = !ev.value;
      bg1PaletteBinding.hidden = !ev.value;

      PANE_SETTINGS.bg1Pipelines[PaletteCyclePostFxPipeline.name] = ev.value;
      this.#updatePipelines(this.#bgImage1, PANE_SETTINGS.bg1Pipelines);

      if (ev.value) {
        this.#bgImage1.setTexture(PANE_SETTINGS.bg1PaletteCycle.gradient);
        const pipeline = this.#bgImage1.getPostPipeline(PaletteCyclePostFxPipeline.name) as PaletteCyclePostFxPipeline;
        if (pipeline) {
          pipeline.setPalette(PANE_SETTINGS.bg1PaletteCycle.palette);
        }
      } else {
        this.#bgImage1.setTexture(PANE_SETTINGS.background1);
      }
    });

    const bg1PipelinesFolder = bg1Folder.addFolder({ title: 'Pipelines' });
    Object.keys(PANE_SETTINGS.bg1Pipelines).forEach((pipelineName) => {
      bg1PipelinesFolder.addBinding(PANE_SETTINGS.bg1Pipelines, pipelineName).on('change', () => {
        this.#updatePipelines(this.#bgImage1, PANE_SETTINGS.bg1Pipelines);
      });
    });

    // --- Background 2 Controls ---
    const bg2Folder = this.#pane.addFolder({ title: 'Background 2' });

    const bg2TextureBinding = bg2Folder
      .addBinding(PANE_SETTINGS, 'background2', {
        label: 'Texture',
        options: bgOptions,
        hidden: PANE_SETTINGS.bg2PaletteCycle.enabled,
      })
      .on('change', (ev) => {
        this.#bgImage2.setTexture(ev.value);
      });

    const bg2GradientBinding = bg2Folder
      .addBinding(PANE_SETTINGS.bg2PaletteCycle, 'gradient', {
        label: 'Gradient',
        options: gradientOptions,
        hidden: !PANE_SETTINGS.bg2PaletteCycle.enabled,
      })
      .on('change', (ev) => {
        this.#bgImage2.setTexture(ev.value);
      });

    const bg2PaletteBinding = bg2Folder
      .addBinding(PANE_SETTINGS.bg2PaletteCycle, 'palette', {
        label: 'Palette',
        options: paletteOptions,
        hidden: !PANE_SETTINGS.bg2PaletteCycle.enabled,
      })
      .on('change', (ev) => {
        const pipeline = this.#bgImage2.getPostPipeline(PaletteCyclePostFxPipeline.name) as PaletteCyclePostFxPipeline;
        if (pipeline) {
          pipeline.setPalette(ev.value);
        }
      });

    bg2Folder.addBinding(PANE_SETTINGS.bg2PaletteCycle, 'enabled', { label: 'Palette Cycle' }).on('change', (ev) => {
      bg2TextureBinding.hidden = ev.value;
      bg2GradientBinding.hidden = !ev.value;
      bg2PaletteBinding.hidden = !ev.value;

      PANE_SETTINGS.bg2Pipelines[PaletteCyclePostFxPipeline.name] = ev.value;
      this.#updatePipelines(this.#bgImage2, PANE_SETTINGS.bg2Pipelines);

      if (ev.value) {
        this.#bgImage2.setTexture(PANE_SETTINGS.bg2PaletteCycle.gradient);
        const pipeline = this.#bgImage2.getPostPipeline(PaletteCyclePostFxPipeline.name) as PaletteCyclePostFxPipeline;
        if (pipeline) {
          pipeline.setPalette(PANE_SETTINGS.bg2PaletteCycle.palette);
        }
      } else {
        this.#bgImage2.setTexture(PANE_SETTINGS.background2);
      }
    });

    const bg2PipelinesFolder = bg2Folder.addFolder({ title: 'Pipelines' });
    Object.keys(PANE_SETTINGS.bg2Pipelines).forEach((pipelineName) => {
      bg2PipelinesFolder.addBinding(PANE_SETTINGS.bg2Pipelines, pipelineName).on('change', () => {
        this.#updatePipelines(this.#bgImage2, PANE_SETTINGS.bg2Pipelines);
      });
    });

    // --- Composite Shader ---
    const compositeFolder = this.#pane.addFolder({ title: 'Composite Shader' });
    compositeFolder
      .addBinding(PANE_SETTINGS, 'alpha', {
        min: 0.0,
        max: 1.0,
        step: 0.01,
        label: 'Alpha',
      })
      .on('change', (ev) => {
        if (this.#finalBackgroundPipeline) {
          this.#finalBackgroundPipeline.alpha = ev.value;
        }
      });
  }

  /**
   * Helper method to update the pipelines on a game object.
   * @param image The game object to update.
   * @param pipelineConfig The pipeline configuration to apply.
   */
  #updatePipelines(image: Phaser.GameObjects.Image, pipelineConfig: Record<string, boolean>): void {
    const pipelinesToApply = Object.entries(pipelineConfig)
      .filter(([, active]) => active)
      .map(([name]) => name);

    // Create a copy of the postPipelines array to iterate over, as removePostPipeline will modify the original array.
    const existingPipelines = [...image.postPipelines];

    for (const pipeline of existingPipelines) {
      image.removePostPipeline(pipeline);
    }

    if (pipelinesToApply.length > 0) {
      image.setPostPipeline(pipelinesToApply);
    }
  }

  /**
   * Creates demo game objects for the mock battle scene. Includes enemies, player information, etc.
   */
  #createDecorations(): void {
    // black panels
    this.add.rectangle(0, 0, this.scale.width, 120, 0x000000, 1).setOrigin(0);
    this.add.rectangle(0, this.scale.height - 120, this.scale.width, 120, 0x000000, 1).setOrigin(0);

    // health panels
    const healthContainers = this.add.container(this.scale.width / 2, this.scale.height - 60, []);
    healthContainers.add([
      this.#createPlayerPanel(-100, 'Warrior', 220, 20),
      this.#createPlayerPanel(0, 'Thief', 150, 30),
      this.#createPlayerPanel(100, 'Mage', 120, 60),
    ]);

    // create animations
    this.anims.create({
      key: ASSET_KEYS.spritesheets.frog,
      frameRate: 8,
      frames: this.anims.generateFrameNames(ASSET_KEYS.spritesheets.frog),
      repeat: -1,
    });
    this.anims.create({
      key: ASSET_KEYS.spritesheets.wizard,
      frameRate: 8,
      frames: this.anims.generateFrameNames(ASSET_KEYS.spritesheets.wizard),
      repeat: -1,
    });

    // create enemies
    this.add
      .sprite(this.scale.width / 2 - 100, this.scale.height / 2, ASSET_KEYS.spritesheets.frog, 0)
      .setScale(2)
      .play('frog');
    this.add
      .sprite(this.scale.width / 2 + 100, this.scale.height / 2 - 30, ASSET_KEYS.spritesheets.wizard, 0)
      .setScale(1.5)
      .play('wizard');
  }

  /**
   * Creates demo game objects for the mock battle information for the player party.
   */
  #createPlayerPanel(x: number, hero: string, hp: number, mp: number): Phaser.GameObjects.Container {
    const container = this.add.container(x, 0, []);
    const panel = this.add.image(0, 0, ASSET_KEYS.other.border);
    const fontStyle = {
      fontFamily: 'custom',
      fontSize: 10,
    };
    const heroName = this.add.text(0, -30, hero, fontStyle).setOrigin(0.5);
    const hpText = this.add.text(-35, 0, `HP  ${hp}`, fontStyle).setOrigin(0, 0.5);
    const mpText = this.add.text(-35, 20, `MP   ${mp}`, fontStyle).setOrigin(0, 0.5);

    container.add([panel, heroName, hpText, mpText]);
    return container;
  }

  /**
   * Creates the image game objects that have custom pipelines applied to them.
   * Then, based on those images, we create two new render textures that we can mix together
   * to get our final effect.
   */
  #createRenderTextures(): void {
    // create background images needed for the render textures
    this.#bgImage1 = this.add
      .image(0, 0, PANE_SETTINGS.background1)
      .setOrigin(0)
      .setDisplaySize(this.scale.width, this.scale.height)
      .setPostPipeline(HorizontalOscillationPostFxPipeline.name);

    this.#bgImage2 = this.add
      .image(0, 0, PANE_SETTINGS.background2)
      .setOrigin(0)
      .setDisplaySize(this.scale.width, this.scale.height)
      .setPostPipeline([VerticalOscillationPostFxPipeline.name, BackgroundScrollingPostFxPipeline.name]);

    // hide the original images
    this.#bgImage1.setVisible(false);
    this.#bgImage2.setVisible(false);

    // create Render Textures for offscreen buffers
    this.#rt1 = this.add.renderTexture(0, 0, this.scale.width, this.scale.height).setOrigin(0).setVisible(false);
    this.#rt2 = this.add.renderTexture(0, 0, this.scale.width, this.scale.height).setOrigin(0).setVisible(false);

    // final image using composite shader
    this.#finalBackground = this.add.rectangle(0, 0, this.scale.width, this.scale.height).setOrigin(0);
    this.#finalBackground.setPostPipeline(TransparencyPostFxPipeline.name);
    // get a reference to the custom pipeline tied to the final background game object
    this.#finalBackgroundPipeline = this.#finalBackground.getPostPipeline(
      TransparencyPostFxPipeline.name,
    ) as TransparencyPostFxPipeline;
  }
}
