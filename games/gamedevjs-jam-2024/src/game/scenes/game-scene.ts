import Phaser from 'phaser';
import { SceneKeys } from './scene-keys';
import { IMAGE_ASSET_KEYS, TILED_LEVEL_JSON } from '../assets/asset-keys';
import { TILED_LAYER_NAMES, TILED_OBJECT_LAYER_NAMES } from '../assets/tiled-keys';
import {
  BUTTON_ACTIVE_OBJECT_TYPE,
  TILED_BUTTON_PROPERTY_NAME,
  TILED_DOOR_PROPERTY_NAME,
  TILED_DOOR_STATE,
  TILED_ENERGY_PROPERTY_NAME,
  TiledButtonObjectSchema,
  TiledDoorObjectSchema,
  TiledDoorObjectStatePropertySchema,
  TiledDoorStateEnum,
  TiledEnergyObjectSchema,
  TiledExitObjectSchema,
  TiledNpcObjectSchema,
  TiledObjectActiveObjectTypePropertySchema,
  TiledObjectCurrentEnergyPropertySchema,
  TiledObjectFlipPropertySchema,
  TiledObjectIdPropertySchema,
  TiledObjectProperty,
  TiledSpeakerObjectSchema,
  TiledTargetObjectIdPropertySchema,
} from '../../schema/tiled-schema';
import { NPC } from '../objects/npc';
import { Speaker } from '../objects/speaker';
import { Button } from '../objects/button';
import { Door } from '../objects/door';

export default class GameScene extends Phaser.Scene {
  #npcs: NPC[];
  #speakers: Speaker[];
  #buttons: Button[];
  #doors: Door[];
  #doorGroup!: Phaser.Physics.Arcade.Group;
  #currentEnergy: number;
  #maxEnergy: number;
  #energyText!: Phaser.GameObjects.Text;
  #exitZone!: Phaser.GameObjects.Zone;

  constructor() {
    super({ key: SceneKeys.GameScene });
    this.#npcs = [];
    this.#speakers = [];
    this.#buttons = [];
    this.#doors = [];
    this.#currentEnergy = 0;
    this.#maxEnergy = 0;
  }

  get currentEnergy(): number {
    return this.#currentEnergy;
  }

  public create(): void {
    // main background
    this.add.image(this.scale.width / 2, this.scale.height / 2, IMAGE_ASSET_KEYS.LEVEL, 0);
    const tiledMapData = this.make.tilemap({ key: TILED_LEVEL_JSON.TILED_LEVEL });
    const exitZone = this.#createExitZone(tiledMapData);
    if (exitZone === undefined) {
      return;
    }
    this.#exitZone = exitZone;
    this.#doorGroup = this.#createDoors(tiledMapData);
    this.#buttons = this.#createButtons(tiledMapData);
    this.#speakers = this.#createSpeakers(tiledMapData);
    this.#npcs = this.#createNpcs(tiledMapData);
    this.#calculateEnergy(tiledMapData);

    const collisionLayer = this.#createCollisionLayer(tiledMapData);
    if (!collisionLayer) {
      return;
    }
    collisionLayer.setCollision(117, true);
    collisionLayer.setAlpha(0);

    this.#npcs.forEach((npc) => {
      const wallCollider = this.physics.add.collider(npc.sprite, collisionLayer, () => {
        npc.collidedWithWall();
      });
      npc.addCollider(wallCollider);
      const doorCollider = this.physics.add.collider(npc.sprite, this.#doorGroup, () => {
        npc.collidedWithWall();
      });
      npc.addCollider(doorCollider);
      const exitOverlap = this.physics.add.overlap(npc.sprite, this.#exitZone, () => {
        npc.hasEnteredExit();
      });
      npc.addCollider(exitOverlap);
      // this.#speakers.forEach((speaker) => {
      //   const speakerOverlap = this.physics.add.overlap(npc.sprite, speaker.speakerRange, () => {
      //     console.log('npc is overlapping with speaker');
      //   });
      // });
    });
    // collisionLayer.renderDebug(this.add.graphics());

    this.#energyText = this.add.text(10, 10, '').setOrigin(0);
    this.#updateEnergyUI();
  }

  public update(): void {
    this.#npcs.forEach((npc) => npc.update());
    this.#speakers.forEach((speaker) => speaker.update());
  }

  public updateEnergy(energyAmount: number): void {
    this.#currentEnergy += energyAmount;
    this.#updateEnergyUI();
  }

  public npcHasLeftScene(): void {
    const hasAllNpcsLeft = this.#npcs.every((npc) => npc.hasExitedLevel);
    if (hasAllNpcsLeft) {
      console.log('level complete');
    } else {
      console.log('keep playing');
    }
  }

  #updateEnergyUI(): void {
    this.#energyText.setText(`${this.currentEnergy} / ${this.#maxEnergy}`);
  }

  #createExitZone(tiledMapData: Phaser.Tilemaps.Tilemap): Phaser.GameObjects.Zone | undefined {
    const layerData = tiledMapData.getObjectLayer(TILED_OBJECT_LAYER_NAMES.EXIT);
    if (!layerData || layerData.objects.length > 1) {
      console.warn(`[${GameScene.name}:#createExitZone] encountered error while parsing tiled map data for level exit`);
      return;
    }
    const parsedObject = TiledExitObjectSchema.safeParse(layerData.objects[0]);
    if (!parsedObject.success) {
      console.warn(
        `[${GameScene.name}:#calculateEnergy] encountered error while parsing tiled map data`,
        parsedObject.error,
      );
      return;
    }
    const obj = parsedObject.data;
    const zone = this.add.zone(obj.x, obj.y, obj.width, obj.height).setOrigin(0, 1);
    this.physics.world.enable(zone);
    return zone;
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
      const npc = new NPC({ scene: this, x: obj.x, y: obj.y, speakers: this.#speakers });
      npcs.push(npc);
    }
    return npcs;
  }

  #createDoors(tiledMapData: Phaser.Tilemaps.Tilemap): Phaser.Physics.Arcade.Group {
    this.#doors = [];
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
      const door = new Door({
        scene: this,
        x: obj.x,
        y: obj.y,
        startingState: this.#getDoorStateFromObject(obj.properties),
        flipX: this.#shouldFlipGameObject(obj.properties),
        id: this.#getIdFromObject(obj.properties),
      });
      gameObjects.add(door.sprite);
      this.#doors.push(door);
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
      const connectedObject = this.#getButtonConnectedObject(obj.properties);
      if (!connectedObject) {
        console.warn(
          `[${GameScene.name}:#createButtons] was not able to find connected object while parsing tiled data`,
        );
        continue;
      }
      const button = new Button({
        scene: this,
        x: obj.x,
        y: obj.y,
        flipX: this.#shouldFlipGameObject(obj.properties),
        startingEnergy: this.#getEnergyDetailsFromObject(obj.properties),
        id: this.#getIdFromObject(obj.properties),
        connectedObject: connectedObject,
      });
      gameObjects.push(button);
    }
    return gameObjects;
  }

  #getButtonConnectedObject(objectProperties: TiledObjectProperty[]) {
    // get the object type from the tiled data
    const activeObjectProp = objectProperties.find(
      (prop) => prop.name === TILED_BUTTON_PROPERTY_NAME.ACTIVE_OBJECT_TYPE,
    );
    if (!activeObjectProp) {
      return;
    }
    const parsedProperty = TiledObjectActiveObjectTypePropertySchema.safeParse(activeObjectProp);
    if (!parsedProperty.success) {
      return;
    }

    // find the object id from the tiled data
    const targetObjectIdProp = objectProperties.find((prop) => prop.name === TILED_BUTTON_PROPERTY_NAME.OBJECT_ID);
    if (targetObjectIdProp === undefined) {
      return;
    }
    const parsedTargetObjectIdProperty = TiledTargetObjectIdPropertySchema.safeParse(targetObjectIdProp);
    if (!parsedTargetObjectIdProperty.success) {
      return;
    }

    // find the matching object in the game objects that have already been created based on the type and id field we found above
    if (parsedProperty.data.value === BUTTON_ACTIVE_OBJECT_TYPE.DOOR) {
      return this.#doors.find((door) => door.id === parsedTargetObjectIdProperty.data.value);
    }
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

  #getDoorStateFromObject(objectProperties: TiledObjectProperty[]): TiledDoorStateEnum {
    const doorStateProp = objectProperties.find((prop) => prop.name === TILED_DOOR_PROPERTY_NAME.STATE);
    if (!doorStateProp) {
      return TILED_DOOR_STATE.CLOSED;
    }
    const parsedProperty = TiledDoorObjectStatePropertySchema.safeParse(doorStateProp);
    if (!parsedProperty.success) {
      return TILED_DOOR_STATE.CLOSED;
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

  #calculateEnergy(tiledMapData: Phaser.Tilemaps.Tilemap): void {
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
