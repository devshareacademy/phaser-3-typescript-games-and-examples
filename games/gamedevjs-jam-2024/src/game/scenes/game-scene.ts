import Phaser from 'phaser';
import { SceneKeys } from './scene-keys';
import { IMAGE_ASSET_KEYS, SPRITE_SHEET_ASSET_KEYS, TILED_LEVEL_JSON } from '../assets/asset-keys';
import { TILED_LAYER_NAMES, TILED_OBJECT_LAYER_NAMES } from '../assets/tiled-keys';
import {
  TILED_DOOR_PROPERTY_NAME,
  TILED_ENERGY_PROPERTY_NAME,
  TiledButtonObjectSchema,
  TiledDoorObjectSchema,
  TiledEnergyObjectSchema,
  TiledNpcObjectSchema,
  TiledObjectCurrentEnergyPropertySchema,
  TiledObjectFlipPropertySchema,
  TiledObjectIdPropertySchema,
  TiledObjectProperty,
  TiledSpeakerObjectSchema,
} from '../../schema/tiled-schema';
import { NPC } from '../objects/npc';
import { Speaker } from '../objects/speaker';
import { Button } from '../objects/button';

export default class GameScene extends Phaser.Scene {
  #npcs: NPC[];
  #speakers: Speaker[];
  #buttons: Button[];
  #doorGroup!: Phaser.Physics.Arcade.Group;
  #currentEnergy: number;
  #maxEnergy: number;

  constructor() {
    super({ key: SceneKeys.GameScene });
    this.#npcs = [];
    this.#speakers = [];
    this.#buttons = [];
    this.#currentEnergy = 0;
    this.#maxEnergy = 0;
  }

  get currentEnergy(): number {
    return this.#currentEnergy;
  }

  public updateEnergy(energyAmount: number): void {
    console.log(`updateEnergy: before amount ${this.#currentEnergy}`);
    this.#currentEnergy += energyAmount;
    console.log(`updateEnergy: new amount ${this.#currentEnergy}`);
  }

  public create(): void {
    // main background
    this.add.image(this.scale.width / 2, this.scale.height / 2, IMAGE_ASSET_KEYS.LEVEL, 0);
    const tiledMapData = this.make.tilemap({ key: TILED_LEVEL_JSON.TILED_LEVEL });
    this.#npcs = this.#createNpcs(tiledMapData);
    this.#doorGroup = this.#createDoors(tiledMapData);
    this.#buttons = this.#createButtons(tiledMapData);
    this.#speakers = this.#createSpeakers(tiledMapData);
    this.#calculateEnergy(tiledMapData);

    const collisionLayer = this.#createCollisionLayer(tiledMapData);
    if (!collisionLayer) {
      return;
    }
    collisionLayer.setCollision(117, true);
    collisionLayer.setAlpha(0);

    this.#npcs.forEach((npc) => {
      this.physics.add.collider(npc.sprite, collisionLayer, () => {
        npc.collidedWithWall();
      });
      this.physics.add.collider(npc.sprite, this.#doorGroup, () => {
        npc.collidedWithWall();
      });
    });
    // collisionLayer.renderDebug(this.add.graphics());

    console.log(this.#currentEnergy, this.#maxEnergy);
  }

  public update(): void {
    this.#npcs.forEach((npc) => npc.update());
  }

  #createNpcs(tiledMapData: Phaser.Tilemaps.Tilemap): NPC[] {
    const layerData = tiledMapData.getObjectLayer(TILED_OBJECT_LAYER_NAMES.NPCS);
    const npcs: NPC[] = [];
    if (!layerData) {
      return npcs;
    }
    const rawObjects = layerData.objects;
    for (const rawObject of rawObjects) {
      const parsedObject = TiledNpcObjectSchema.safeParse(rawObject);
      if (!parsedObject.success) {
        console.warn(
          `[${GameScene.name}:#createNpcs] encountered error while parsing tiled map data`,
          parsedObject.error,
        );
        continue;
      }
      const obj = parsedObject.data;
      const npc = new NPC({ scene: this, x: obj.x, y: obj.y });
      npcs.push(npc);
    }
    return npcs;
  }

  #createDoors(tiledMapData: Phaser.Tilemaps.Tilemap): Phaser.Physics.Arcade.Group {
    const gameObjects = this.physics.add.group({ immovable: true });
    const layerData = tiledMapData.getObjectLayer(TILED_OBJECT_LAYER_NAMES.DOORS);
    if (!layerData) {
      return gameObjects;
    }
    const rawObjects = layerData.objects;
    for (const rawObject of rawObjects) {
      const parsedObject = TiledDoorObjectSchema.safeParse(rawObject);
      if (!parsedObject.success) {
        console.warn(
          `[${GameScene.name}:#createDoors] encountered error while parsing tiled map data`,
          parsedObject.error,
        );
        continue;
      }
      const obj = parsedObject.data;
      const gameObj = this.physics.add
        .sprite(obj.x, obj.y, SPRITE_SHEET_ASSET_KEYS.DOOR, 0)
        .setFlipX(this.#shouldFlipGameObject(obj.properties))
        .setOrigin(0, 0.5);
      gameObjects.add(gameObj);
    }
    return gameObjects;
  }

  #createButtons(tiledMapData: Phaser.Tilemaps.Tilemap): Button[] {
    const layerData = tiledMapData.getObjectLayer(TILED_OBJECT_LAYER_NAMES.BUTTONS);
    const gameObjects: Button[] = [];
    if (!layerData) {
      return gameObjects;
    }
    const rawObjects = layerData.objects;
    for (const rawObject of rawObjects) {
      const parsedObject = TiledButtonObjectSchema.safeParse(rawObject);
      if (!parsedObject.success) {
        console.warn(
          `[${GameScene.name}:#createButtons] encountered error while parsing tiled map data`,
          parsedObject.error,
        );
        continue;
      }
      const obj = parsedObject.data;
      const button = new Button({
        scene: this,
        x: obj.x,
        y: obj.y,
        flipX: this.#shouldFlipGameObject(obj.properties),
        startingEnergy: this.#getEnergyDetailsFromObject(obj.properties),
        id: this.#getIdFromObject(obj.properties),
      });
      gameObjects.push(button);
    }
    return gameObjects;
  }

  #createSpeakers(tiledMapData: Phaser.Tilemaps.Tilemap): Speaker[] {
    const layerData = tiledMapData.getObjectLayer(TILED_OBJECT_LAYER_NAMES.SPEAKERS);
    const gameObjects: Speaker[] = [];
    if (!layerData) {
      return gameObjects;
    }
    const rawObjects = layerData.objects;
    for (const rawObject of rawObjects) {
      const parsedObject = TiledSpeakerObjectSchema.safeParse(rawObject);
      if (!parsedObject.success) {
        console.warn(
          `[${GameScene.name}:#createSpeakers] encountered error while parsing tiled map data`,
          parsedObject.error,
        );
        continue;
      }
      const obj = parsedObject.data;
      const speaker = new Speaker({
        scene: this,
        x: obj.x,
        y: obj.y,
        flipX: this.#shouldFlipGameObject(obj.properties),
        startingEnergy: this.#getEnergyDetailsFromObject(obj.properties),
        id: this.#getIdFromObject(obj.properties),
      });
      gameObjects.push(speaker);
    }
    return gameObjects;
  }

  #shouldFlipGameObject(objectProperties: TiledObjectProperty[]): boolean {
    const flipProp = objectProperties.find((prop) => prop.name === TILED_DOOR_PROPERTY_NAME.FLIP);
    if (!flipProp) {
      return false;
    }
    const parsedProperty = TiledObjectFlipPropertySchema.safeParse(flipProp);
    if (!parsedProperty.success) {
      return false;
    }
    return parsedProperty.data.value;
  }

  #getEnergyDetailsFromObject(objectProperties: TiledObjectProperty[]): number {
    const energyProp = objectProperties.find((prop) => prop.name === TILED_ENERGY_PROPERTY_NAME.CURRENT_ENERGY);
    if (!energyProp) {
      return 0;
    }
    const parsedProperty = TiledObjectCurrentEnergyPropertySchema.safeParse(energyProp);
    if (!parsedProperty.success) {
      return 0;
    }
    return parsedProperty.data.value;
  }

  #getIdFromObject(objectProperties: TiledObjectProperty[]): number {
    const idProp = objectProperties.find((prop) => prop.name === TILED_DOOR_PROPERTY_NAME.ID);
    if (!idProp) {
      return -1;
    }
    const parsedProperty = TiledObjectIdPropertySchema.safeParse(idProp);
    if (!parsedProperty.success) {
      return 0;
    }
    return parsedProperty.data.value;
  }

  #createCollisionLayer(tiledMapData: Phaser.Tilemaps.Tilemap): Phaser.Tilemaps.TilemapLayer | undefined {
    const collisionTiles = tiledMapData.addTilesetImage(
      IMAGE_ASSET_KEYS.COLLISION.toLowerCase(),
      IMAGE_ASSET_KEYS.COLLISION,
    );
    if (!collisionTiles) {
      console.warn(`[${GameScene.name}:create] encountered error while creating collision tiles from tiled`);
      return;
    }
    const collisionLayer = tiledMapData.createLayer(TILED_LAYER_NAMES.COLLISION, collisionTiles, 0, 0);
    if (!collisionLayer) {
      console.warn(`[${GameScene.name}:create] encountered error while creating collision layer using data from tiled`);
      return;
    }
    return collisionLayer;
  }

  #calculateEnergy(tiledMapData: Phaser.Tilemaps.Tilemap) {
    const layerData = tiledMapData.getObjectLayer(TILED_OBJECT_LAYER_NAMES.ENERGY);
    if (!layerData || layerData.objects.length > 1) {
      console.warn(
        `[${GameScene.name}:#calculateEnergy] encountered error while parsing tiled map data for starting energy`,
      );
      return;
    }
    const parsedObject = TiledEnergyObjectSchema.safeParse(layerData.objects[0]);
    if (!parsedObject.success) {
      console.warn(
        `[${GameScene.name}:#calculateEnergy] encountered error while parsing tiled map data`,
        parsedObject.error,
      );
      return;
    }
    // starting energy
    this.#currentEnergy = this.#getEnergyDetailsFromObject(parsedObject.data.properties);
    this.#maxEnergy = this.#currentEnergy;

    let energyUsedByDevices = 0;
    this.#buttons.forEach((button) => (energyUsedByDevices += button.currentEnergy));
    this.#speakers.forEach((speaker) => (energyUsedByDevices += speaker.currentEnergy));
    this.#maxEnergy += energyUsedByDevices;
  }
}
