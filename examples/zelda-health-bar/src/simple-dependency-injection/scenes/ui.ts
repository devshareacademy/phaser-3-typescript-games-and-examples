import { HEALTH_EVENTS } from '../components/events';
import Health from '../components/health';

const ASSET_KEY = 'ASSET_KEY';

const HEALTH_ANIMATIONS = {
  LOSE_FIRST_HALF: 'LOSE_FIRST_HALF',
  LOSE_SECOND_HALF: 'LOSE_SECOND_HALF',
} as const;

export class Ui extends Phaser.Scene {
  #customEventEmitter: Phaser.Events.EventEmitter;
  #health: Health;

  constructor(emitter: Phaser.Events.EventEmitter, health: Health) {
    super({ key: 'Ui', active: true });
    this.#customEventEmitter = emitter;
    this.#health = health;
  }

  preload(): void {
    this.load.spritesheet(ASSET_KEY, 'assets/images/heart.png', {
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

    const numberOfHearts = Math.round(this.#health.maxHealth / 2);
    const hearts: Phaser.GameObjects.Sprite[] = [];
    for (let i = 0; i < numberOfHearts; i++) {
      const heart = this.add
        .sprite(10 + i * 63, 10, ASSET_KEY, 0)
        .setScale(8)
        .setOrigin(0);
      hearts.push(heart);
    }

    this.#customEventEmitter.on(HEALTH_EVENTS.LOSE_HEALTH, (newHealth, prevHealth) => {
      console.log('event received', newHealth, prevHealth);
      const heartIndex = Math.round(prevHealth / 2) - 1;
      const isHalfHeart = prevHealth % 2 === 1;
      if (isHalfHeart) {
        hearts[heartIndex].play(HEALTH_ANIMATIONS.LOSE_SECOND_HALF);
      } else {
        hearts[heartIndex].play(HEALTH_ANIMATIONS.LOSE_FIRST_HALF);
      }
    });
  }
}
