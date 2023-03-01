import { health } from '../components/health';

export class Game extends Phaser.Scene {
  constructor() {
    super({ key: 'Game', active: true });
  }

  create(): void {
    this.input.on(Phaser.Input.Events.POINTER_DOWN as string, () => {
      health.loseHealth();
    });
  }
}
