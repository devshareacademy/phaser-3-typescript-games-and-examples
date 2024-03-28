import Phaser from 'phaser';
import { FolderApi, Pane } from 'tweakpane';
import { WipePostFxPipeline } from '../shaders/wipe-post-fx-pipeline';
import { CurtainRisePostFxPipeline } from '../shaders/curtain-rise-post-fx-pipeline';
import { CurtainFallPostFxPipeline } from '../shaders/curtain-fall-post-fx-pipeline';
import { CustomPostFxPipeline } from '../shaders/custom-post-fx-pipeline';
import { SHADER_TEXTURE_ASSET_KEYS } from '../common';

const IMAGE_ASSET_KEY = 'BG';

export class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainScene' });
  }

  preload(): void {
    // load in data
    this.load.image(IMAGE_ASSET_KEY, 'assets/images/bg.png');
    this.load.image(SHADER_TEXTURE_ASSET_KEYS.WIPE, 'assets/images/wipe-left-to-right.png');
    this.load.image(SHADER_TEXTURE_ASSET_KEYS.VERT_REFLECT, 'assets/images/wipe-vertical-reflected.png');
    this.load.image(SHADER_TEXTURE_ASSET_KEYS.SPIRAL, 'assets/images/spinning-spiral.png');
    this.load.image(SHADER_TEXTURE_ASSET_KEYS.TRIANGLE, 'assets/images/enclosing-triangles.png');
  }

  create(): void {
    // Create game objects
    this.add.image(0, 0, IMAGE_ASSET_KEY).setOrigin(0);

    // example for adding post-fx pipeline
    // add the pipeline to our renderer
    (this.renderer as Phaser.Renderer.WebGL.WebGLRenderer).pipelines.addPostPipeline(
      'WipePostFxPipeline',
      WipePostFxPipeline,
    );
    (this.renderer as Phaser.Renderer.WebGL.WebGLRenderer).pipelines.addPostPipeline(
      'CurtainRisePostFxPipeline',
      CurtainRisePostFxPipeline,
    );
    (this.renderer as Phaser.Renderer.WebGL.WebGLRenderer).pipelines.addPostPipeline(
      'CurtainFallPostFxPipeline',
      CurtainFallPostFxPipeline,
    );

    (this.renderer as Phaser.Renderer.WebGL.WebGLRenderer).pipelines.addPostPipeline(
      'CustomPostFxPipeline',
      CustomPostFxPipeline,
    );

    // update camera to use post pipeline
    this.cameras.main.setPostPipeline(WipePostFxPipeline);
    this.cameras.main.setPostPipeline(CurtainRisePostFxPipeline);
    this.cameras.main.setPostPipeline(CurtainFallPostFxPipeline);
    this.cameras.main.setPostPipeline(CustomPostFxPipeline);

    this.#createPane();

    this.tweens.add({
      targets: this.cameras.main.getPostPipeline('CustomPostFxPipeline'),
      progress: 1,
      duration: 2000,
      onComplete: () => {
        this.time.delayedCall(600, () => {
          (this.cameras.main.getPostPipeline('CustomPostFxPipeline') as CustomPostFxPipeline).progress = 0;
        });
      },
    });
  }

  #createPane(): void {
    const SHADER_OPTIONS = {
      NONE: 'NONE',
      WIPE: 'WIPE',
      CURTAIN_RISE: 'CURTAIN_RISE',
      CURTAIN_FALL: 'CURTAIN_FALL',
    } as const;

    const pane = new Pane();
    const view = pane.addBlade({
      view: 'list',
      label: 'shader',
      options: [
        { text: 'none', value: SHADER_OPTIONS.NONE },
        { text: 'wipe', value: SHADER_OPTIONS.WIPE },
        { text: 'curtain rise', value: SHADER_OPTIONS.CURTAIN_RISE },
        { text: 'curtain fall', value: SHADER_OPTIONS.CURTAIN_FALL },
      ],
      value: SHADER_OPTIONS.NONE,
    });
    pane.addBlade({
      view: 'separator',
    });
    const f1 = this.#addWipePane(pane);
    const f2 = this.#addCurtainRisePane(pane);
    const f3 = this.#addCurtainFallPane(pane);

    pane.on('change', (ev) => {
      if (ev.target !== view) {
        return;
      }

      f1.hidden = true;
      f2.hidden = true;
      f3.hidden = true;
      (this.cameras.main.getPostPipeline('WipePostFxPipeline') as WipePostFxPipeline).progress = 0;
      (this.cameras.main.getPostPipeline('CurtainRisePostFxPipeline') as CurtainRisePostFxPipeline).progress = 1;
      (this.cameras.main.getPostPipeline('CurtainFallPostFxPipeline') as WipePostFxPipeline).progress = 0;
      pane.refresh();

      if (ev.value === SHADER_OPTIONS.WIPE) {
        f1.hidden = false;
        return;
      }

      if (ev.value === SHADER_OPTIONS.CURTAIN_RISE) {
        f2.hidden = false;
        return;
      }

      if (ev.value === SHADER_OPTIONS.CURTAIN_FALL) {
        f3.hidden = false;
        return;
      }
    });
  }

  #addWipePane(pane: Pane): FolderApi {
    const f1 = pane.addFolder({
      title: 'Wipe FX',
      hidden: true,
    });
    f1.addBinding(this.cameras.main.getPostPipeline('WipePostFxPipeline') as WipePostFxPipeline, 'progress', {
      min: 0,
      max: 1,
    });
    const btn = f1.addButton({
      title: 'Play Transition',
    });
    btn.on('click', () => {
      pane.disabled = true;
      this.tweens.add({
        targets: this.cameras.main.getPostPipeline('WipePostFxPipeline'),
        progress: 1,
        duration: 2000,
        onUpdate: () => pane.refresh(),
        onComplete: () => {
          this.time.delayedCall(600, () => {
            (this.cameras.main.getPostPipeline('WipePostFxPipeline') as WipePostFxPipeline).progress = 0;
            pane.refresh();
            pane.disabled = false;
          });
        },
      });
    });
    return f1;
  }

  #addCurtainRisePane(pane: Pane): FolderApi {
    const f2 = pane.addFolder({
      title: 'Curtain Fall FX',
      hidden: true,
    });
    f2.addBinding(
      this.cameras.main.getPostPipeline('CurtainRisePostFxPipeline') as CurtainRisePostFxPipeline,
      'progress',
      {
        min: 0,
        max: 1,
      },
    );
    const btn2 = f2.addButton({
      title: 'Play Transition',
    });
    btn2.on('click', () => {
      pane.disabled = true;
      (this.cameras.main.getPostPipeline('CurtainRisePostFxPipeline') as CurtainRisePostFxPipeline).progress = 0;
      pane.refresh();
      this.tweens.add({
        targets: this.cameras.main.getPostPipeline('CurtainRisePostFxPipeline'),
        progress: 1,
        duration: 2000,
        onUpdate: () => pane.refresh(),
        onComplete: () => {
          this.time.delayedCall(600, () => {
            (this.cameras.main.getPostPipeline('CurtainRisePostFxPipeline') as CurtainRisePostFxPipeline).progress = 1;
            pane.refresh();
            pane.disabled = false;
          });
        },
      });
    });
    return f2;
  }

  #addCurtainFallPane(pane: Pane): FolderApi {
    const folder = pane.addFolder({
      title: 'Curtain Fall FX',
      hidden: true,
    });
    folder.addBinding(
      this.cameras.main.getPostPipeline('CurtainFallPostFxPipeline') as CurtainFallPostFxPipeline,
      'progress',
      {
        min: 0,
        max: 1,
      },
    );
    const button = folder.addButton({
      title: 'Play Transition',
    });
    button.on('click', () => {
      pane.disabled = true;
      pane.refresh();
      this.tweens.add({
        targets: this.cameras.main.getPostPipeline('CurtainFallPostFxPipeline'),
        progress: 1,
        duration: 2000,
        onUpdate: () => pane.refresh(),
        onComplete: () => {
          this.time.delayedCall(600, () => {
            (this.cameras.main.getPostPipeline('CurtainFallPostFxPipeline') as CurtainFallPostFxPipeline).progress = 0;
            pane.refresh();
            pane.disabled = false;
          });
        },
      });
    });
    return folder;
  }
}
