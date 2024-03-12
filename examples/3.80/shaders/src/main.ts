import Phaser from 'phaser';
import { Pane } from 'tweakpane';
import { WipeFx, NothingFx, TintFx, TintPostFx } from './shaders';
import { BasicScene } from './scenes/basic-scene';
import { TransitionsScene } from './scenes/transitions-scene';

const IMAGE_ASSET_KEY = 'BG';
const SPRITE_SHEET_ASSET_KEY = 'CHARACTERS';

// class Game extends Phaser.Scene {
//   #tintFx!: Phaser.Renderer.WebGL.Pipelines.MultiPipeline;

//   constructor() {
//     super({ key: 'Game' });
//   }

//   preload(): void {
//     // load in data
//     this.load.image(IMAGE_ASSET_KEY, 'assets/images/bg.png');
//     this.load.spritesheet(SPRITE_SHEET_ASSET_KEY, 'assets/images/custom.png', {
//       frameWidth: 64,
//       frameHeight: 88,
//     });

//     // example for loading glsl files
//     this.load.glsl('fireball', 'assets/shaders/shader0.frag');
//     this.load.glsl('wipe', 'assets/shaders/wipe.frag');
//     this.load.glsl('tint', 'assets/shaders/tint.frag');
//   }

//   create(): void {
//     // Create game objects
//     const bg = this.add.image(0, 0, IMAGE_ASSET_KEY).setOrigin(0);
//     this.add.image(487, 310, SPRITE_SHEET_ASSET_KEY, 7);

//     // create tint pipelines
//     this.#createTintPipelines();
//     //bg.setPipeline(this.#tintFx);

//     // example for adding pre-fx pipeline
//     // const fx = new WipeFx(this.game);
//     // const tintFx = new TintFx(game);
//     // (this.renderer as Phaser.Renderer.WebGL.WebGLRenderer).pipelines.add('WipePreFx', fx);
//     // (this.renderer as Phaser.Renderer.WebGL.WebGLRenderer).pipelines.add('TintFx', tintFx);
//     // // bg.setPipeline(fx);
//     // // this.tweens.add({
//     // //   targets: fx,
//     // //   progress: 1,
//     // //   duration: 2000,
//     // // });
//     // bg.setPipeline(tintFx);

//     // example for adding post-fx pipeline
//     // (this.renderer as Phaser.Renderer.WebGL.WebGLRenderer).pipelines.addPostPipeline('TintPostFx', TintPostFx);
//     // this.cameras.main.setPostPipeline('TintPostFx');

//     //(this.renderer as Phaser.Renderer.WebGL.WebGLRenderer).pipelines.addPostPipeline('WipePostFx', WipeFx);
//     //this.cameras.main.setPostPipeline('WipePostFx');
//     // this.tweens.add({
//     //   targets: this.cameras.main.getPostPipeline('WipePostFx'),
//     //   progress: 1,
//     //   duration: 2000,
//     // });

//     // tweakpane
//     const pane = new Pane();
//     // const tab = pane.addTab({
//     //   pages: [{ title: 'Background' }, { title: 'Camera' }],
//     // });

//     // const folder = pane.addFolder({
//     //   title: 'Shaders',
//     //   expanded: true,
//     // });
//     // const PARAMS = {
//     //   none: true,
//     //   backgroundTint: false,
//     // };
//     // folder
//     //   .addBinding(PARAMS, 'none', {
//     //     label: 'none',
//     //   })
//     //   .on('change', (ev) => {
//     //     if (ev.value) {
//     //       bg.resetPipeline();
//     //       this.cameras.main.resetPostPipeline();
//     //     }
//     //   });

//     // folder
//     //   .addBinding(PARAMS, 'backgroundTint', {
//     //     label: 'background - tint',
//     //   })
//     //   .on('change', (ev) => {
//     //     if (ev.value) {
//     //       this.cameras.main.resetPostPipeline();
//     //       bg.setPipeline(this.#tintFx);
//     //     }
//     //   });

//     // const backgroundFolder = pane.addFolder({
//     //   title: 'Background',
//     //   expanded: true,
//     // });
//     // const cameraFolder = pane.addFolder({
//     //   title: 'Camera',
//     //   expanded: true,
//     // });

//     type ShaderOption = keyof typeof SHADER_OPTIONS;
//     const SHADER_OPTIONS = {
//       NONE: 'NONE',
//       TINT_BACKGROUND: 'TINT_BACKGROUND',
//       TINT_CAMERA: 'TINT_CAMERA',
//     } as const;

//     // eslint-disable-next-line @typescript-eslint/no-unsafe-call
//     (
//       pane.addBlade({
//         view: 'list',
//         label: 'shader',
//         options: [
//           { text: 'none', value: SHADER_OPTIONS.NONE },
//           { text: 'tint - background', value: SHADER_OPTIONS.TINT_BACKGROUND },
//           { text: 'tint - camera', value: SHADER_OPTIONS.TINT_CAMERA },
//         ],
//         value: SHADER_OPTIONS.NONE,
//         // eslint-disable-next-line @typescript-eslint/no-explicit-any
//       }) as any
//     )
//       // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
//       .on('change', (ev) => {
//         // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
//         const val = ev.value as ShaderOption;
//         console.log(val);

//         bg.resetPipeline();
//         this.cameras.main.resetPostPipeline();
//         switch (val) {
//           case SHADER_OPTIONS.TINT_BACKGROUND:
//             bg.setPipeline(this.#tintFx);
//             break;
//           case SHADER_OPTIONS.TINT_CAMERA:
//             this.cameras.main.setPostPipeline('TintPostFx');
//             break;
//           default:
//             break;
//         }
//       });

//     // type ShaderOption = keyof typeof SHADER_OPTIONS;
//     // const SHADER_OPTIONS = {
//     //   none: 'none',
//     //   tint: 'tint - background',
//     //   tintCamera: 'tint - camera',
//     // } as const;

//     // tab.pages[0].addBinding(...);

//     // const backgroundParams = {
//     //   shader: SHADER_OPTIONS.none,
//     // };

//     // pane
//     //   .addBinding(backgroundParams, 'shader', {
//     //     options: SHADER_OPTIONS,
//     //   })
//     //   .on('change', (ev) => {
//     //     bg.resetPipeline();
//     //     this.cameras.main.resetPostPipeline();
//     //     const val = ev.value as ShaderOption;
//     //     console.log(val);
//     //     switch (val) {
//     //       case 'tint':
//     //         bg.setPipeline(this.#tintFx);
//     //         break;
//     //       case 'tintCamera':
//     //         this.cameras.main.setPostPipeline('TintPostFx');
//     //         break;
//     //       default:
//     //         break;
//     //     }
//     //   });

//     // const cameraParams = {
//     //   shader: 'none',
//     // };

//     // tab.pages[1]
//     //   .addBinding(cameraParams, 'shader', {
//     //     options: SHADER_OPTIONS,
//     //   })
//     //   .on('change', (ev) => {
//     //     const val = ev.value as ShaderOption;
//     //     switch (val) {
//     //       case SHADER_OPTIONS.none:
//     //         this.cameras.main.resetPostPipeline();
//     //         break;
//     //       case SHADER_OPTIONS.tint:
//     //         this.cameras.main.setPostPipeline('TintPostFx');
//     //         break;
//     //     }
//     //   });
//   }

//   #createTintPipelines(): void {
//     // old way with two classes
//     // const tintFx = new TintFx(game);

//     // new way, refactor
//     this.#tintFx = new Phaser.Renderer.WebGL.Pipelines.MultiPipeline({
//       game: this.game,
//       renderTarget: true,
//       fragShader: (this.cache.shader.get('tint') as Phaser.Display.BaseShader).fragmentSrc,
//     });
//     (this.renderer as Phaser.Renderer.WebGL.WebGLRenderer).pipelines.add('TintFx', this.#tintFx);
//     (this.renderer as Phaser.Renderer.WebGL.WebGLRenderer).pipelines.addPostPipeline('TintPostFx', TintPostFx);
//   }
// }

const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.WEBGL,
  pixelArt: true,
  scale: {
    parent: 'game-container',
    width: 1024,
    height: 576,
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  // pipeline: { TintFx, TintPostFx },
  backgroundColor: '#5c5b5b',
};

const game = new Phaser.Game(gameConfig);
game.scene.add(BasicScene.name, BasicScene);
game.scene.add(TransitionsScene.name, TransitionsScene);
game.scene.start(TransitionsScene.name);
