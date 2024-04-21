import Phaser from 'phaser';
import { SceneKeys } from './scene-keys';
import {
  ATLAS_ASSET_KEYS,
  AUDIO_ASSET_KEYS,
  DATA_ASSET_KEYS,
  IMAGE_ASSET_KEYS,
  SPRITE_SHEET_ASSET_KEYS,
  TILED_LEVEL_JSON,
  TUTORIAL_IMAGE_ASSET_KEYS,
} from '../assets/asset-keys';
import { DataUtils } from '../utils/data-utils';
import { WebFontFileLoader } from '../assets/web-font-file-loader';

export default class PreloadScene extends Phaser.Scene {
  #sceneStartedTime: number;
  #startSceneTransition: boolean;

  constructor() {
    super({ key: SceneKeys.PreloadScene });
    this.#sceneStartedTime = 0;
    this.#startSceneTransition = false;
  }

  public init(): void {
    this.#sceneStartedTime = Date.now();
    this.#startSceneTransition = false;
  }

  public preload(): void {
    this.cameras.main.fadeIn(1000, 0, 0, 0);
    this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x000000, 1).setOrigin(0);
    this.add.text(this.scale.width / 2, 40, 'Built using Phaser 3').setOrigin(0.5);
    this.add.image(this.scale.width / 2, 160, IMAGE_ASSET_KEYS.PHASER_LOGO, 0).setScale(0.5);

    // load in data
    this.load.setPath('assets/images/npc1');
    this.load.spritesheet(SPRITE_SHEET_ASSET_KEYS.NPC_1_IDLE, '/Idle.png', {
      frameWidth: 48,
      frameHeight: 48,
    });
    this.load.spritesheet(SPRITE_SHEET_ASSET_KEYS.NPC_1_WALK, '/Walk.png', {
      frameWidth: 48,
      frameHeight: 48,
    });
    this.load.setPath('assets/images/objects');
    this.load.image(IMAGE_ASSET_KEYS.BRIDGE_TILE, '/bridgeTile.png');
    this.load.image(IMAGE_ASSET_KEYS.BRIDGE_SUPPORT, '/bridgeSupport.png');
    this.load.image(IMAGE_ASSET_KEYS.BRIDGE_BASE, '/bridgeBase.png');
    this.load.spritesheet(SPRITE_SHEET_ASSET_KEYS.SPEAKER, '/custom_screen1.png', {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet(SPRITE_SHEET_ASSET_KEYS.BUTTON, '/custom_screen2.png', {
      frameWidth: 32,
      frameHeight: 42,
    });
    this.load.spritesheet(SPRITE_SHEET_ASSET_KEYS.DOOR, '/Entry.png', {
      frameWidth: 32,
      frameHeight: 64,
    });
    this.load.spritesheet(SPRITE_SHEET_ASSET_KEYS.BELT_START, '/Transporter1.png', {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet(SPRITE_SHEET_ASSET_KEYS.BELT_MID, '/Transporter2.png', {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet(SPRITE_SHEET_ASSET_KEYS.BELT_END, '/Transporter3.png', {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet(SPRITE_SHEET_ASSET_KEYS.HAMMER, '/Hammer.png', {
      frameWidth: 32,
      frameHeight: 64,
    });
    this.load.spritesheet(SPRITE_SHEET_ASSET_KEYS.FENCE, '/fence.png', {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.setPath('assets/levels');
    this.load.image(IMAGE_ASSET_KEYS.LEVEL_1, '/test_level.png');
    this.load.tilemapTiledJSON(TILED_LEVEL_JSON.TILED_LEVEL_1, '/test_level.json');
    this.load.image(IMAGE_ASSET_KEYS.LEVEL_2, '/test_level2.png');
    this.load.tilemapTiledJSON(TILED_LEVEL_JSON.TILED_LEVEL_2, '/test_level2.json');
    this.load.image(IMAGE_ASSET_KEYS.LEVEL_3, '/test_level3.png');
    this.load.tilemapTiledJSON(TILED_LEVEL_JSON.TILED_LEVEL_3, '/test_level3.json');
    this.load.image(IMAGE_ASSET_KEYS.LEVEL_4, '/test_level4.png');
    this.load.tilemapTiledJSON(TILED_LEVEL_JSON.TILED_LEVEL_4, '/test_level4.json');
    this.load.image(IMAGE_ASSET_KEYS.LEVEL_5, '/test_level5.png');
    this.load.tilemapTiledJSON(TILED_LEVEL_JSON.TILED_LEVEL_5, '/test_level5.json');
    this.load.image(IMAGE_ASSET_KEYS.LEVEL_6, '/test_level6.png');
    this.load.tilemapTiledJSON(TILED_LEVEL_JSON.TILED_LEVEL_6, '/test_level6.json');
    this.load.image(IMAGE_ASSET_KEYS.LEVEL_7, '/test_level7.png');
    this.load.tilemapTiledJSON(TILED_LEVEL_JSON.TILED_LEVEL_7, '/test_level7.json');
    this.load.image(IMAGE_ASSET_KEYS.LEVEL_8, '/test_level8.png');
    this.load.tilemapTiledJSON(TILED_LEVEL_JSON.TILED_LEVEL_8, '/test_level8.json');
    this.load.setPath('assets/images');
    this.load.image(IMAGE_ASSET_KEYS.COLLISION, '/collision.png');
    this.load.image(IMAGE_ASSET_KEYS.DASH_CIRCLE, '/dash-circle.png');
    this.load.image(IMAGE_ASSET_KEYS.BACKGROUND, '/Background.png');
    this.load.image(IMAGE_ASSET_KEYS.OVERLAY, '/overlay/28.png');
    this.load.setPath('assets/data');
    this.load.json(DATA_ASSET_KEYS.ANIMATIONS, '/animations.json');
    this.load.setPath('assets/images/flare');
    this.load.atlas(ATLAS_ASSET_KEYS.FLARES, '/flares.png', '/flares.json');
    this.load.setPath('assets/images/ui');
    this.load.image(IMAGE_ASSET_KEYS.NPC_MODAL, '/npc_modal.png');
    this.load.image(IMAGE_ASSET_KEYS.MAIN_MODAL, '/main_modal.png');
    this.load.image(IMAGE_ASSET_KEYS.ENERGY, '/energy.png');
    this.load.image(IMAGE_ASSET_KEYS.PROFILE_HEAD, '/head.png');
    this.load.image(IMAGE_ASSET_KEYS.INFO_PANEL, '/info_modal.png');
    this.load.image(IMAGE_ASSET_KEYS.FULLSCREEN_BUTTON, 'transparentDark28.png');

    this.load.setPath('assets/images/tutorial');
    this.load.image(TUTORIAL_IMAGE_ASSET_KEYS.TUTORIAL_SPEAKER, '/speaker.png');
    this.load.image(TUTORIAL_IMAGE_ASSET_KEYS.TUTORIAL_ENERGY, '/energy.png');

    this.load.setPath('assets/images/title/background');
    this.load.image(IMAGE_ASSET_KEYS.TITLE_BG_1, '/1.png');
    this.load.image(IMAGE_ASSET_KEYS.TITLE_BG_2, '/2.png');
    this.load.image(IMAGE_ASSET_KEYS.TITLE_BG_3, '/3.png');
    this.load.image(IMAGE_ASSET_KEYS.TITLE_BG_4, '/4.png');
    this.load.image(IMAGE_ASSET_KEYS.TITLE_BG_5, '/5.png');
    this.load.setPath('assets/images/title');
    this.load.image(IMAGE_ASSET_KEYS.TITLE_TEXT_1, '/title3.png');
    this.load.image(IMAGE_ASSET_KEYS.TITLE_TEXT_2, '/title2.png');

    // load custom fonts
    this.load.addFile(new WebFontFileLoader(this.load, ['Orbitron:400']));

    // load audio
    this.load.setPath('assets/audio');
    this.load.audio(AUDIO_ASSET_KEYS.BG_1, '/Track01.ogg');
    this.load.audio(AUDIO_ASSET_KEYS.BG_2, '/Track02.ogg');
    this.load.audio(AUDIO_ASSET_KEYS.DOOR_CLOSE, '/beam.ogg');
    this.load.audio(AUDIO_ASSET_KEYS.SPEAKER_BEEP, '/BEEP_Targeting_Loop_06.wav');
    this.load.audio(AUDIO_ASSET_KEYS.SWITCH_BEEP, '/UIBeep_Lock_On_05.wav');
    this.load.audio(AUDIO_ASSET_KEYS.EXPLOSION, '/explosion.ogg');
  }

  public create(): void {
    this.#createAnimations();
  }

  public update(): void {
    this.#transitionToNextScene();
  }

  #transitionToNextScene(): void {
    if (this.#startSceneTransition) {
      return;
    }
    // TODO: fix fade timer and time check
    if (Date.now() - this.#sceneStartedTime > 1) {
      this.#startSceneTransition = true;
      this.cameras.main.fadeOut(1, 0, 0, 0, (camera, progress) => {
        if (progress === 1) {
          this.scene.start(SceneKeys.TitleScene);
        }
      });
    }
  }

  #createAnimations(): void {
    const animations = DataUtils.getAnimations(this);
    animations.forEach((animation) => {
      const frames = animation.frames
        ? this.anims.generateFrameNumbers(animation.assetKey, { frames: animation.frames })
        : this.anims.generateFrameNumbers(animation.assetKey);
      this.anims.create({
        key: animation.key,
        frames: frames,
        frameRate: animation.frameRate,
        repeat: animation.repeat,
        delay: animation.delay,
        yoyo: animation.yoyo,
        repeatDelay: animation.repeatDelay,
      });
    });
  }
}
