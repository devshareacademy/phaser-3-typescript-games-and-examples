import Phaser from 'phaser';
import { FolderApi, Pane } from 'tweakpane';
import { WipePostFxPipeline } from '../shaders/wipe-post-fx-pipeline';
import { CurtainRisePostFxPipeline } from '../shaders/curtain-rise-post-fx-pipeline';
import { CurtainFallPostFxPipeline } from '../shaders/curtain-fall-post-fx-pipeline';
import { CustomPipeline } from '../shaders/custom-pipeline';
import { ClosingBarsPostFxPipeline } from '../shaders/closing-bars-post-fx-pipeline';
import { OpeningBarsPostFxPipeline } from '../shaders/opening-bars-post-fx-pipeline';
import { FadeToWhitePostFxPipeline } from '../shaders/fade-to-white-post-fx-pipeline';
import { FadeToBlackPostFxPipeline } from '../shaders/fade-to-black-post-fx-pipeline';

const IMAGE_ASSET_KEY = 'BG';

const pipelines = [
  WipePostFxPipeline,
  CurtainRisePostFxPipeline,
  CurtainFallPostFxPipeline,
  ClosingBarsPostFxPipeline,
  OpeningBarsPostFxPipeline,
  FadeToWhitePostFxPipeline,
  FadeToBlackPostFxPipeline,
];

export class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainScene' });
  }

  preload(): void {
    // load in data
    this.load.image(IMAGE_ASSET_KEY, 'assets/images/bg.png');
  }

  create(): void {
    // Create game objects
    this.add.image(0, 0, IMAGE_ASSET_KEY).setOrigin(0);

    // example for adding post-fx pipeline
    // add the pipeline to our renderer & update camera to use post pipeline
    pipelines.forEach((pipeline) => {
      (this.renderer as Phaser.Renderer.WebGL.WebGLRenderer).pipelines.addPostPipeline(pipeline.name, pipeline);
      this.cameras.main.setPostPipeline(pipeline);
    });

    this.#createPane();
  }

  #createPane(): void {
    const SHADER_OPTIONS = {
      NONE: 'NONE',
      WIPE: 'WIPE',
      CURTAIN_RISE: 'CURTAIN_RISE',
      CURTAIN_FALL: 'CURTAIN_FALL',
      OPEN_BARS: 'OPEN_BARS',
      CLOSE_BARS: 'CLOSE_BARS',
      FADE_TO_WHITE: 'FADE_TO_WHITE',
      FADE_TO_BLACK: 'FADE_TO_BLACK',
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
        { text: 'open bars', value: SHADER_OPTIONS.OPEN_BARS },
        { text: 'closing bars', value: SHADER_OPTIONS.CLOSE_BARS },
        { text: 'fade to white', value: SHADER_OPTIONS.FADE_TO_WHITE },
        { text: 'fade to black', value: SHADER_OPTIONS.FADE_TO_BLACK },
      ],
      value: SHADER_OPTIONS.NONE,
    });
    pane.addBlade({
      view: 'separator',
    });
    const f1 = this.#addPaneForFx({ pane, paneTitle: 'Wipe Fx', pipeline: WipePostFxPipeline });
    const f2 = this.#addPaneForFx({
      pane,
      paneTitle: 'Curtain Rise Fx',
      pipeline: CurtainRisePostFxPipeline,
      flipProgressValue: true,
    });
    const f3 = this.#addPaneForFx({ pane, paneTitle: 'Curtain Fall Fx', pipeline: CurtainFallPostFxPipeline });
    const f4 = this.#addPaneForFx({
      pane,
      paneTitle: 'Opening Bars Fx',
      pipeline: OpeningBarsPostFxPipeline,
      flipProgressValue: true,
    });
    const f5 = this.#addPaneForFx({ pane, paneTitle: 'Closing Bars Fx', pipeline: ClosingBarsPostFxPipeline });
    const f6 = this.#addPaneForFx({ pane, paneTitle: 'Fade To White Fx', pipeline: FadeToWhitePostFxPipeline });
    const f7 = this.#addPaneForFx({ pane, paneTitle: 'Fade To Black Fx', pipeline: FadeToBlackPostFxPipeline });

    pane.on('change', (ev) => {
      if (ev.target !== view) {
        return;
      }

      f1.hidden = true;
      f2.hidden = true;
      f3.hidden = true;
      f4.hidden = true;
      f5.hidden = true;
      f6.hidden = true;
      f7.hidden = true;
      (this.cameras.main.getPostPipeline(WipePostFxPipeline) as CustomPipeline).progress = 0;
      (this.cameras.main.getPostPipeline(CurtainRisePostFxPipeline) as CustomPipeline).progress = 1;
      (this.cameras.main.getPostPipeline(WipePostFxPipeline) as CustomPipeline).progress = 0;
      (this.cameras.main.getPostPipeline(OpeningBarsPostFxPipeline) as CustomPipeline).progress = 1;
      (this.cameras.main.getPostPipeline(ClosingBarsPostFxPipeline) as CustomPipeline).progress = 0;
      (this.cameras.main.getPostPipeline(FadeToWhitePostFxPipeline) as CustomPipeline).progress = 0;
      (this.cameras.main.getPostPipeline(FadeToBlackPostFxPipeline) as CustomPipeline).progress = 0;
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

      if (ev.value === SHADER_OPTIONS.OPEN_BARS) {
        f4.hidden = false;
        return;
      }

      if (ev.value === SHADER_OPTIONS.CLOSE_BARS) {
        f5.hidden = false;
        return;
      }

      if (ev.value === SHADER_OPTIONS.FADE_TO_WHITE) {
        f6.hidden = false;
        return;
      }

      if (ev.value === SHADER_OPTIONS.FADE_TO_BLACK) {
        f7.hidden = false;
        return;
      }
    });
  }

  #addPaneForFx<T extends typeof CustomPipeline>(config: {
    pane: Pane;
    pipeline: T;
    paneTitle: string;
    flipProgressValue?: boolean;
  }): FolderApi {
    const { pane, pipeline, paneTitle, flipProgressValue = false } = config;
    const folder = pane.addFolder({
      title: paneTitle,
      hidden: true,
    });
    folder.addBinding(this.cameras.main.getPostPipeline(pipeline) as CustomPipeline, 'progress', {
      min: 0,
      max: 1,
    });
    const button = folder.addButton({
      title: 'Play Transition',
    });
    button.on('click', () => {
      pane.disabled = true;
      (this.cameras.main.getPostPipeline(pipeline) as CustomPipeline).progress = 0;
      pane.refresh();
      this.tweens.add({
        targets: this.cameras.main.getPostPipeline(pipeline),
        progress: 1,
        duration: 2000,
        onUpdate: () => pane.refresh(),
        onComplete: () => {
          this.time.delayedCall(600, () => {
            (this.cameras.main.getPostPipeline(pipeline) as CustomPipeline).progress = flipProgressValue ? 1 : 0;
            pane.refresh();
            pane.disabled = false;
          });
        },
      });
    });
    return folder;
  }
}
