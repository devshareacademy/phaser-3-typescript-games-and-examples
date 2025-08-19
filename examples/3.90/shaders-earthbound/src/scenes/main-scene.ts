import { PaletteCyclePostFxPipeline } from '../shaders/palette-cycle-post-fx-pipeline';
import { BaseScene } from './base-scene';
import { ASSETS } from '../assets';

const SETTINGS = {
  palette: 'palette_fire',
};

export class MainScene extends BaseScene {
  private palettePipeline!: PaletteCyclePostFxPipeline;
  private paletteTileSprite!: Phaser.GameObjects.TileSprite;

  constructor() {
    super({ key: 'MainScene' });
  }

  create(): void {
    const renderer = this.renderer as Phaser.Renderer.WebGL.WebGLRenderer;
    if (!renderer.pipelines.get(PaletteCyclePostFxPipeline.name)) {
      renderer.pipelines.addPostPipeline(PaletteCyclePostFxPipeline.name, PaletteCyclePostFxPipeline);
    }

    this.bgImage = this.add.image(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2 + 70,
      this.backgroundTextureKey,
    );
    this.bgImage.setScale(1.5);
    this.bgImage.setPostPipeline(PaletteCyclePostFxPipeline.name);
    this.palettePipeline = this.bgImage.getPostPipeline(PaletteCyclePostFxPipeline.name) as PaletteCyclePostFxPipeline;
    this.palettePipeline.setPalette(SETTINGS.palette);

    this.createDemoVisuals();
    this.createPane();
  }

  update(time: number, delta: number): void {
    if (this.paletteTileSprite && this.palettePipeline) {
      const speed = this.palettePipeline.cycleSpeed;
      this.paletteTileSprite.tilePositionX += (delta / 1000) * speed;
    }
  }

  private createDemoVisuals(): void {
    const centerX = this.cameras.main.width / 2;
    const startY = 50;

    this.add
      .text(centerX, startY, 'Palette Cycling', {
        fontSize: '24px',
        fontFamily: '"Arial Black", Gadget, sans-serif',
      })
      .setOrigin(0.5);

    const paletteTexture = this.textures.get(SETTINGS.palette);
    const paletteWidth = paletteTexture.source[0].width;
    const visHeight = 24;

    this.paletteTileSprite = this.add.tileSprite(centerX, startY + 50, paletteWidth, visHeight, SETTINGS.palette);
  }

  protected createPane(): void {
    super.createPane('Palette Cycling Controls');

    this.pane
      .addBinding(SETTINGS, 'palette', {
        view: 'list',
        label: 'Palette',
        options: Object.keys(ASSETS.palettes).map((key) => ({ text: key, value: key })),
      })
      .on('change', (ev) => {
        this.palettePipeline.setPalette(ev.value);
        this.paletteTileSprite.setTexture(ev.value);
      });

    this.pane.addBinding(this.palettePipeline, 'cycleSpeed', {
      min: 0,
      max: 200,
      step: 1,
      label: 'Cycle Speed',
    });
  }
}
