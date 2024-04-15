import Phaser from 'phaser';
import { SceneKeys } from './scene-keys';
import {
  ATLAS_ASSET_KEYS,
  DATA_ASSET_KEYS,
  IMAGE_ASSET_KEYS,
  SPRITE_SHEET_ASSET_KEYS,
  TILED_LEVEL_JSON,
} from '../assets/asset-keys';
import { DataUtils } from '../utils/data-utils';

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: SceneKeys.PreloadScene });
  }

  public preload(): void {
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
    this.load.spritesheet(SPRITE_SHEET_ASSET_KEYS.SPEAKER, '/Screen1.png', {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet(SPRITE_SHEET_ASSET_KEYS.BUTTON, '/Screen2.png', {
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
    this.load.setPath('assets/images');
    this.load.image(IMAGE_ASSET_KEYS.COLLISION, '/collision.png');
    this.load.image(IMAGE_ASSET_KEYS.DASH_CIRCLE, '/dash-circle.png');
    this.load.setPath('assets/data');
    this.load.json(DATA_ASSET_KEYS.ANIMATIONS, '/animations.json');
    this.load.setPath('assets/images/flare');
    this.load.atlas(ATLAS_ASSET_KEYS.FLARES, '/flares.png', '/flares.json');
  }

  public create(): void {
    this.#createAnimations();
    this.scene.start(SceneKeys.GameScene);
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
