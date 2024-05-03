import * as Phaser from 'phaser';
import { Player } from './player';
import { Belt } from './belt';

export class Game extends Phaser.Scene {
  #player!: Player;
  #belt!: Belt;

  constructor() {
    super({ key: 'Game' });
  }

  public preload(): void {
    this.load.setPath('assets/images');
    this.load.image('LEVEL', 'level.png');
    this.load.spritesheet('BELT', 'belt.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('PUNK_IDLE', 'Punk_idle.png', { frameWidth: 48, frameHeight: 48 });
    this.load.spritesheet('PUNK_RUN', 'Punk_run.png', { frameWidth: 48, frameHeight: 48 });
  }

  public create(): void {
    this.add.image(0, 0, 'LEVEL', 0).setOrigin(0);

    const floor = this.add.zone(0, 192, this.scale.width, 1).setOrigin(0);
    this.physics.world.enable(floor);
    (floor.body as Phaser.Physics.Arcade.Body).setImmovable(true).setAllowGravity(false);

    this.#belt = new Belt(this);
    this.#player = new Player(this, floor, this.#belt);
  }

  public update(): void {
    this.#player.update();
    this.#belt.update();
  }
}

const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.WEBGL,
  pixelArt: true,
  scale: {
    parent: 'game-container',
    width: 512,
    height: 288,
    zoom: 2,
  },
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      gravity: {
        y: 800,
        x: 0,
      },
    },
  },
  scene: [Game],
};

new Phaser.Game(gameConfig);
