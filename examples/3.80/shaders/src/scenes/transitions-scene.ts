import Phaser from 'phaser';
import { Pane } from 'tweakpane';
import { CurtainFallFx, WipeFx } from '../shaders';

const IMAGE_ASSET_KEY = 'BG';
const SPRITE_SHEET_ASSET_KEY = 'CHARACTERS';

export class TransitionsScene extends Phaser.Scene {
  constructor() {
    super({ key: TransitionsScene.name });
  }

  preload(): void {
    // load in data
    this.load.image(IMAGE_ASSET_KEY, 'assets/images/bg.png');
    this.load.spritesheet(SPRITE_SHEET_ASSET_KEY, 'assets/images/custom.png', {
      frameWidth: 64,
      frameHeight: 88,
    });

    (this.renderer as Phaser.Renderer.WebGL.WebGLRenderer).pipelines.addPostPipeline('WipePostFx', WipeFx);
    this.cameras.main.setPostPipeline('WipePostFx');

    (this.renderer as Phaser.Renderer.WebGL.WebGLRenderer).pipelines.addPostPipeline(
      'CurtainFallPostFx',
      CurtainFallFx,
    );
    this.cameras.main.setPostPipeline('CurtainFallPostFx');

    const SHADER_OPTIONS = {
      NONE: 'NONE',
      WIPE: 'WIPE',
      CURTAIN_FALL: 'CURTAIN_FALL',
    } as const;

    const pane = new Pane();
    const view = pane.addBlade({
      view: 'list',
      label: 'shader',
      options: [
        { text: 'none', value: SHADER_OPTIONS.NONE },
        { text: 'wipe', value: SHADER_OPTIONS.WIPE },
        { text: 'curtain fall', value: SHADER_OPTIONS.CURTAIN_FALL },
      ],
      value: SHADER_OPTIONS.NONE,
    });
    pane.addBlade({
      view: 'separator',
    });
    const f1 = pane.addFolder({
      title: 'Wipe FX',
      hidden: true,
    });
    f1.addBinding(this.cameras.main.getPostPipeline('WipePostFx') as WipeFx, 'progress', {
      min: 0,
      max: 1,
    });
    const btn = f1.addButton({
      title: 'Play Transition',
    });
    btn.on('click', () => {
      pane.disabled = true;
      this.tweens.add({
        targets: this.cameras.main.getPostPipeline('WipePostFx'),
        progress: 1,
        duration: 2000,
        onComplete: () => {
          this.time.delayedCall(600, () => {
            (this.cameras.main.getPostPipeline('WipePostFx') as WipeFx).progress = 0;
            pane.refresh();
            pane.disabled = false;
          });
        },
      });
    });

    const f2 = pane.addFolder({
      title: 'Curtain Fall FX',
      hidden: true,
    });
    f2.addBinding(this.cameras.main.getPostPipeline('CurtainFallPostFx') as WipeFx, 'progress', {
      min: 0,
      max: 1,
    });
    const btn2 = f2.addButton({
      title: 'Play Transition',
    });
    btn2.on('click', () => {
      pane.disabled = true;
      this.tweens.add({
        targets: this.cameras.main.getPostPipeline('CurtainFallPostFx'),
        progress: 0,
        duration: 2000,
        onComplete: () => {
          this.time.delayedCall(600, () => {
            (this.cameras.main.getPostPipeline('CurtainFallPostFx') as WipeFx).progress = 1;
            pane.refresh();
            pane.disabled = false;
          });
        },
      });
    });

    pane.on('change', (ev) => {
      if (ev.target !== view) {
        return;
      }

      f1.hidden = true;
      f2.hidden = true;
      (this.cameras.main.getPostPipeline('WipePostFx') as WipeFx).progress = 0;
      (this.cameras.main.getPostPipeline('CurtainFallPostFx') as WipeFx).progress = 1;
      pane.refresh();

      if (ev.value === SHADER_OPTIONS.WIPE) {
        f1.hidden = false;
        return;
      }

      if (ev.value === SHADER_OPTIONS.CURTAIN_FALL) {
        f2.hidden = false;
        return;
      }
    });
  }

  create(): void {
    // Create game objects
    this.add.image(0, 0, IMAGE_ASSET_KEY).setOrigin(0);
    this.add.image(487, 310, SPRITE_SHEET_ASSET_KEY, 7);
  }
}
