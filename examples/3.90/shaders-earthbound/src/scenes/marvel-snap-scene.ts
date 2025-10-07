import { BaseScene } from './base-scene';
import { MarvelSnapBackgroundFX } from '../shaders/marvel-snap-background-fx-pipeline';
import { MarvelSnapHeroFX } from '../shaders/marvel-snap-hero-fx-pipeline';

export class MarvelSnapScene extends BaseScene {
  private supes?: Phaser.GameObjects.Plane;
  private bg?: Phaser.GameObjects.Image;
  private frame?: Phaser.GameObjects.Image;
  private logo?: Phaser.GameObjects.Image;

  constructor() {
    super({ key: 'MarvelSnapScene' });
  }

  init() {
    const renderer = this.game.renderer as Phaser.Renderer.WebGL.WebGLRenderer;
    if (!renderer.pipelines.get('MarvelSnapHeroFX')) {
      renderer.pipelines.addPostPipeline('MarvelSnapHeroFX', MarvelSnapHeroFX);
    }
    if (!renderer.pipelines.get('MarvelSnapBackgroundFX')) {
      renderer.pipelines.addPostPipeline(
        'MarvelSnapBackgroundFX',
        MarvelSnapBackgroundFX
      );
    }
  }

  preload(): void {
    this.load.image('supes', 'assets/snap/supes.png');
    this.load.image('supes_bg', 'assets/snap/supes_bg.png');
    this.load.image('frame', 'assets/snap/frame_shade.png');
    this.load.image('glow', 'assets/snap/frame_glow.png');
    this.load.image('logo', 'assets/snap/supes_logo.png');
    this.load.image('noise', 'assets/images/shader/noise.png');
  }

  create(): void {
    const { width, height } = this.cameras.main;

    if (!this.textures.exists('supes_displacement')) {
      const displacementTexture = this.textures.createCanvas(
        'supes_displacement',
        256,
        256
      );
      if (displacementTexture) {
        const context = displacementTexture.getContext();
        context.fillStyle = 'rgb(128, 128, 128)';
        context.fillRect(0, 0, 256, 256);
        displacementTexture.refresh();
      }
    }

    if (!this.textures.exists('supes_cape_mask')) {
      const capeMaskTexture = this.textures.createCanvas(
        'supes_cape_mask',
        256,
        256
      );
      if (capeMaskTexture) {
        const context = capeMaskTexture.getContext();
        context.fillStyle = 'rgb(0, 0, 0)';
        context.fillRect(0, 0, 256, 256);
        capeMaskTexture.refresh();
      }
    }

    const glow = this.add.image(0, 0, 'glow');
    this.bg = this.add.image(0, 0, 'supes_bg').setScale(1.2);
    this.supes = this.add.plane(0, 0, 'supes', undefined, undefined, 32, 32);
    this.frame = this.add.image(0, 0, 'frame');
    this.logo = this.add.image(0, -250, 'logo').setScale(0.7);

    this.add.container(width / 2, height / 2, [
      glow,
      this.bg,
      this.supes,
      this.frame,
      this.logo,
    ]);

    this.supes.setPostPipeline('MarvelSnapHeroFX');
    this.bg.setPostPipeline('MarvelSnapBackgroundFX');
  }

  update(time: number): void {
    if (!this.supes || !this.bg || !this.frame || !this.logo) {
      return;
    }

    const heroPipeline = this.supes.getPostPipeline(
      'MarvelSnapHeroFX'
    ) as MarvelSnapHeroFX;
    const bgPipeline = this.bg.getPostPipeline(
      'MarvelSnapBackgroundFX'
    ) as MarvelSnapBackgroundFX;

    if (Array.isArray(heroPipeline)) {
      heroPipeline[0].time = time / 1000;
    } else {
      heroPipeline.time = time / 1000;
    }

    const { width, height } = this.cameras.main;
    const pointer = this.input.activePointer;
    const mouseX = (pointer.x / width - 0.5) * 2;
    const mouseY = (pointer.y / height - 0.5) * 2;

    if (Array.isArray(bgPipeline)) {
      bgPipeline[0].mouseX = -mouseX;
      bgPipeline[0].mouseY = -mouseY;
    } else {
      bgPipeline.mouseX = -mouseX;
      bgPipeline.mouseY = -mouseY;
    }

    const frameParallax = 15;
    if (this.frame && this.logo) {
      this.frame.x = -mouseX * frameParallax;
      this.frame.y = -mouseY * frameParallax;
      this.logo.x = -mouseX * frameParallax;
      this.logo.y = -250 - mouseY * frameParallax;
    }
  }
}
