import * as Phaser from 'phaser';
import { SceneKeys } from './scene-keys';
import { Player } from '../objects/player';
import { Asteroids } from '../objects/asteroids';

export default class GameScene extends Phaser.Scene {
  #playerLives!: number;
  #score!: number;
  #player!: Player;
  #asteroids!: Asteroids;
  #scoreText!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: SceneKeys.GameScene });
  }

  create(): void {
    if (this.input.keyboard === null) {
      console.log('Phaser Keyboard Plugin does not exist, cannot play game.');
      return;
    }
    const cursorKeys = this.input.keyboard.createCursorKeys();
    this.#playerLives = 3;
    this.#score = 0;
    this.#player = new Player(this, cursorKeys);
    this.#asteroids = new Asteroids(this);
    this.#createCollisions();
    this.#scoreText = this.add.text(this.scale.width / 2, 20, '0', { fontSize: '24px' }).setOrigin(0.5);

    // setup custom phaser scene events
    this.events.once(
      Phaser.Scenes.Events.SHUTDOWN,
      () => {
        this.physics.world.off(Phaser.Physics.Arcade.Events.WORLD_STEP, this.worldStep, this);
      },
      this,
    );
    this.physics.world.on(Phaser.Physics.Arcade.Events.WORLD_STEP, this.worldStep, this);
  }

  update(timestamp: DOMHighResTimeStamp, delta: number): void {
    this.#player.update(delta);
    this.#asteroids.update();
  }

  worldStep(delta: number): void {
    this.#player.worldStep(delta);
  }

  #createCollisions(): void {
    this.physics.add.overlap(this.#player.ship, this.#asteroids.asteroidGroup, (playerShip, asteroid) => {
      this.cameras.main.shake(300, 0.05);
      this.#player.destroyShip();
      this.#asteroids.destroyAsteroid(asteroid as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody);

      this.#playerLives -= 1;
      if (this.#playerLives > 0) {
        this.time.delayedCall(500, () => this.#player.respawnShip());
      } else {
        // TODO game is over
      }
    });
    this.physics.add.overlap(this.#player.bulletGroup, this.#asteroids.asteroidGroup, (bullet, asteroid) => {
      this.#player.destroyBullet(bullet as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody);
      const points = this.#asteroids.destroyAsteroid(asteroid as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody);
      this.#score += points;
      this.#scoreText.setText(this.#score.toString());
    });
  }
}
