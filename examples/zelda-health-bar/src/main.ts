import Phaser from 'phaser';

const ASSET_KEY = 'ASSET_KEY';

const HEALTH_ANIMATIONS = {
  LOSE_FIRST_HALF: 'LOSE_FIRST_HALF',
  LOSE_SECOND_HALF: 'LOSE_SECOND_HALF',
} as const;

class Game extends Phaser.Scene {
  constructor() {
    super({ key: 'Game' });
  }

  preload(): void {
    this.load.spritesheet(ASSET_KEY, 'https://devshareacademy.github.io/cdn/images/spritesheets/custom/heart.png', {
      frameWidth: 7,
      frameHeight: 7,
    });
  }

  create(): void {
    this.anims.create({
      key: HEALTH_ANIMATIONS.LOSE_FIRST_HALF,
      frames: this.anims.generateFrameNumbers(ASSET_KEY, { start: 0, end: 2 }),
      frameRate: 10,
    });

    this.anims.create({
      key: HEALTH_ANIMATIONS.LOSE_SECOND_HALF,
      frames: this.anims.generateFrameNumbers(ASSET_KEY, { start: 2, end: 4 }),
      frameRate: 10,
    });

    let health = 6;
    const numberOfHearts = Math.round(health / 2);
    const hearts: Phaser.GameObjects.Sprite[] = [];
    for (let i = 0; i < numberOfHearts; i++) {
      const heart = this.add
        .sprite(10 + i * 63, 10, ASSET_KEY, 0)
        .setScale(8)
        .setOrigin(0);
      hearts.push(heart);
    }
    this.input.on(Phaser.Input.Events.POINTER_DOWN as string, () => {
      if (health === 0) {
        return;
      }
      const heartIndex = Math.round(health / 2) - 1;
      const isHalfHeart = health % 2 === 1;
      if (isHalfHeart) {
        hearts[heartIndex].play(HEALTH_ANIMATIONS.LOSE_SECOND_HALF);
      } else {
        hearts[heartIndex].play(HEALTH_ANIMATIONS.LOSE_FIRST_HALF);
      }
      health -= 1;
    });
  }
}

const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.CANVAS,
  pixelArt: true,
  scale: {
    parent: 'game-container',
    width: 800,
    height: 600,
  },
  backgroundColor: '#5c5b5b',
  scene: [Game],
};

const game = new Phaser.Game(gameConfig);
