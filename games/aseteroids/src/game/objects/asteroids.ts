import { IMAGE_ASSET_KEYS } from '../assets/asset-keys';

const asteroidProperties: {
  [key: number]: {
    minVelocity: number;
    maxVelocity: number;
    score: number;
  };
} = {
  3: {
    minVelocity: 1,
    maxVelocity: 150,
    score: 50,
  },
  2: {
    minVelocity: 5,
    maxVelocity: 180,
    score: 100,
  },
  1: {
    minVelocity: 10,
    maxVelocity: 200,
    score: 200,
  },
};

export class Asteroids {
  #scene: Phaser.Scene;
  #asteroidGroup!: Phaser.GameObjects.Group;

  constructor(scene: Phaser.Scene) {
    this.#scene = scene;
    this.#setupAsteroids();
  }

  get asteroidGroup(): Phaser.GameObjects.Group {
    return this.#asteroidGroup;
  }

  update(): void {
    this.#scene.physics.world.wrap(this.#asteroidGroup, 32);
  }

  destroyAsteroid(asteroid: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody): number {
    this.#asteroidGroup.killAndHide(asteroid);
    asteroid.body.setEnable(false);

    const score = asteroidProperties[asteroid.state as number].score;
    const asteroidState = ((asteroid.state as number) -= 1);
    if (asteroidState > 0) {
      this.#createAsteroid(
        asteroid.x,
        asteroid.y,
        asteroidState === 2 ? IMAGE_ASSET_KEYS.ASTEROID_MED : IMAGE_ASSET_KEYS.ASTEROID_SM,
        asteroidState,
        2,
      );
    }
    return score;
  }

  #createAsteroid(x: number, y: number, asset: string, state: number, pieces: number): void {
    for (let i = 0; i < pieces; i += 1) {
      const asteroid = this.#asteroidGroup.getFirstDead(true) as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
      asteroid
        .setPosition(x, y)
        .setTexture(asset)
        .setScale(1.5)
        .setMaxVelocity(asteroidProperties[state].maxVelocity)
        .setState(state)
        .setVisible(true)
        .setActive(true);
      asteroid.body.setEnable(true).setAngularVelocity(Phaser.Math.Between(-50, 50)).setSize();

      const randomAngle = Phaser.Math.Angle.Random();
      const randomVelocity = Phaser.Math.Between(
        asteroidProperties[state].minVelocity,
        asteroidProperties[state].minVelocity + 10,
      );
      this.#scene.physics.velocityFromRotation(randomAngle, randomVelocity, asteroid.body.acceleration);
    }
  }

  #setupAsteroids(): void {
    this.#asteroidGroup = this.#scene.physics.add.group();
    for (let i = 0; i < 4; i += 1) {
      const side = Math.round(Math.random());
      let x: number;
      let y: number;

      if (side) {
        x = Math.round(Math.random()) * this.#scene.scale.width;
        y = Math.random() * this.#scene.scale.height;
      } else {
        x = Math.random() * this.#scene.scale.width;
        y = Math.round(Math.random()) * this.#scene.scale.height;
      }

      this.#createAsteroid(x, y, IMAGE_ASSET_KEYS.ASTEROID_LG, 3, 1);
    }
  }
}
