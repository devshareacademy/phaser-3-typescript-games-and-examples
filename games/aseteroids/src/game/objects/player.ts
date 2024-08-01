import * as Phaser from 'phaser';
import { IMAGE_ASSET_KEYS } from '../assets/asset-keys';

const bulletProperties = {
  speed: 400,
  interval: 250,
  lifespan: 2,
  maxCount: 15,
};

export class Player {
  #scene: Phaser.Scene;
  #ship!: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
  #controls: Phaser.Types.Input.Keyboard.CursorKeys;
  #bulletGroup!: Phaser.GameObjects.Group;
  #fireBulletInterval!: number;

  constructor(scene: Phaser.Scene, input: Phaser.Types.Input.Keyboard.CursorKeys) {
    this.#scene = scene;
    this.#controls = input;
    this.#createShip();
    this.#createBulletGroup();
  }

  get ship(): Phaser.Types.Physics.Arcade.ImageWithDynamicBody {
    return this.#ship;
  }

  get bulletGroup(): Phaser.GameObjects.Group {
    return this.#bulletGroup;
  }

  update(delta: number): void {
    this.#handleShipMovement();
    this.#handleBulletUpdate(delta);
  }

  worldStep(delta: number): void {
    (this.#bulletGroup.getChildren() as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody[]).forEach((bullet) => {
      if (!bullet.active) {
        return;
      }
      (bullet.state as number) -= delta;
      if ((bullet.state as number) <= 0) {
        bullet.disableBody(true, true);
      }
    });
  }

  destroyBullet(bullet: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody): void {
    this.#bulletGroup.killAndHide(bullet);
    bullet.body.setEnable(false);
  }

  destroyShip(): void {
    this.#ship.setActive(false).setVisible(false);
    this.#ship.body.setEnable(false);
  }

  respawnShip(): void {
    this.#ship.setAngle(-90).setVisible(true).setActive(true);
    this.#ship.body.reset(this.#scene.scale.width / 2, this.#scene.scale.height / 2);
    this.#ship.body.setEnable(true);
  }

  #handleShipMovement(): void {
    if (!this.#ship.active) {
      return;
    }

    if (this.#controls.left.isDown) {
      this.#ship.body.setAngularVelocity(-300);
    } else if (this.#controls.right.isDown) {
      this.#ship.body.setAngularVelocity(300);
    } else {
      this.#ship.body.setAngularVelocity(0);
    }

    if (this.#controls.up.isDown) {
      this.#scene.physics.velocityFromRotation(this.#ship.rotation, 200, this.#ship.body.acceleration);
    } else {
      this.#ship.body.setAcceleration(0);
    }

    this.#ship.scene.physics.world.wrap(this.#ship, 32);
  }

  #handleBulletUpdate(delta: number): void {
    if (!this.#ship.active) {
      return;
    }

    this.#ship.scene.physics.world.wrap(this.#bulletGroup, 32);

    this.#fireBulletInterval -= delta;
    if (this.#fireBulletInterval > 0) {
      return;
    }

    if (this.#controls.space.isDown) {
      const bullet = this.#bulletGroup.getFirstDead() as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody | undefined;
      if (!bullet) {
        return;
      }

      const noseOffset = this.#scene.physics.velocityFromRotation(this.#ship.rotation, this.#ship.width * 0.5);
      const x = this.#ship.x + noseOffset.x;
      const y = this.#ship.y + noseOffset.y;
      bullet.enableBody(true, x, y, true, true);
      const direction = noseOffset.normalize();
      const targetAngle = Phaser.Math.Angle.Between(x, y, x + direction.x * 100, y + direction.y * 100);
      const vel = this.#scene.physics.velocityFromRotation(targetAngle, bulletProperties.speed);
      bullet.body.velocity = vel;
      bullet.setState(bulletProperties.lifespan);

      this.#fireBulletInterval = bulletProperties.interval;
    }
  }

  #createShip(): void {
    this.#ship = this.#scene.physics.add
      .image(this.#scene.scale.width / 2, this.#scene.scale.height / 2, IMAGE_ASSET_KEYS.SHIP, 0)
      .setAngle(-90)
      .setDamping(true)
      .setDrag(0.4)
      .setMaxVelocity(200);
  }

  #createBulletGroup(): void {
    this.#fireBulletInterval = 0;
    this.#bulletGroup = this.#scene.physics.add.group({
      enable: false,
    });
    this.#bulletGroup.createMultiple({
      key: IMAGE_ASSET_KEYS.BULLET,
      quantity: bulletProperties.maxCount,
      active: false,
      visible: false,
    });
  }
}
