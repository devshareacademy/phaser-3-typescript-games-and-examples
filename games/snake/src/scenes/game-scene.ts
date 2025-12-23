import * as Phaser from 'phaser';
import { ASSET_KEYS, SCENE_KEYS } from '../common';

export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENE_KEYS.GAME_SCENE });
  }

  public create(): void {
    console.log('hola');
  }
}
