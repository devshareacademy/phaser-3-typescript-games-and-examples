import Health from '../components/health';

export class Game extends Phaser.Scene {
  #health: Health;

  constructor(health: Health) {
    super({ key: 'Game', active: true });
    this.#health = health;
  }

  create(): void {
    this.input.on(Phaser.Input.Events.POINTER_DOWN as string, () => {
      this.#health.loseHealth();
    });
  }
}
