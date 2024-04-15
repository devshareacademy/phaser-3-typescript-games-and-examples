import { z } from 'zod';

export const TiledObjectFlipPropertySchema = z.object({
  name: z.literal('flip'),
  type: z.literal('bool'),
  value: z.boolean(),
});

export const TiledStopsPropertySchema = z.object({
  name: z.literal('stops'),
  type: z.literal('string'),
  value: z.string(),
});

export const TiledObjectIdPropertySchema = z.object({
  name: z.literal('id'),
  type: z.literal('int'),
  value: z.number(),
});

export const TiledObjectCurrentEnergyPropertySchema = z.object({
  name: z.literal('currentEnergy'),
  type: z.literal('int'),
  value: z.number(),
});

export const TiledTargetObjectIdPropertySchema = z.object({
  name: z.literal('objectId'),
  type: z.literal('int'),
  value: z.number(),
});

export const BUTTON_ACTIVE_OBJECT_TYPE = {
  DOOR: 'Door',
  BELT: 'Belt',
  BRIDGE: 'Bridge',
} as const;
export const TiledButtonActiveTypeEnumSchema = z.nativeEnum(BUTTON_ACTIVE_OBJECT_TYPE);
export type TiledButtonActiveTypeEnum = z.infer<typeof TiledButtonActiveTypeEnumSchema>;

export const TiledObjectActiveObjectTypePropertySchema = z.object({
  name: z.literal('activeObjectType'),
  type: z.literal('string'),
  value: TiledButtonActiveTypeEnumSchema,
  propertytype: z.literal('ButtonActivateObjectType'),
});

export const TILED_DOOR_PROPERTY_NAME = {
  FLIP: 'flip',
  ID: 'id',
} as const;
export const TiledDoorPropertyEnumSchema = z.nativeEnum(TILED_DOOR_PROPERTY_NAME);
export type TiledDoorPropertyEnum = z.infer<typeof TiledDoorPropertyEnumSchema>;

export const TiledObjectPropertySchema = z.object({
  name: z.string(),
  type: z.string(),
  value: z.unknown(),
  propertytype: z.string().optional(),
});
export type TiledObjectProperty = z.infer<typeof TiledObjectPropertySchema>;

export const TiledDoorObjectSchema = z.object({
  x: z.number(),
  y: z.number(),
  type: z.literal('Door'),
  properties: z
    .array(TiledObjectPropertySchema)
    .refine(
      (elements) => Object.values(TILED_DOOR_PROPERTY_NAME).every((el: string) => elements.some((x) => x.name === el)),
      {
        message: `There are missing names. Required names are ${Object.values(TILED_DOOR_PROPERTY_NAME).join(', ')}`,
      },
    ),
});
export type TiledDoorObject = z.infer<typeof TiledDoorObjectSchema>;

export const TILED_BUTTON_PROPERTY_NAME = {
  FLIP: 'flip',
  ID: 'id',
  OBJECT_ID: 'objectId',
  ACTIVE_OBJECT_TYPE: 'activeObjectType',
  CURRENT_ENERGY: 'currentEnergy',
} as const;
export const TiledButtonPropertyEnumSchema = z.nativeEnum(TILED_BUTTON_PROPERTY_NAME);
export type TiledButtonPropertyEnum = z.infer<typeof TiledButtonPropertyEnumSchema>;

export const TiledButtonObjectSchema = z.object({
  x: z.number(),
  y: z.number(),
  type: z.literal('Button'),
  properties: z
    .array(TiledObjectPropertySchema)
    .refine(
      (elements) =>
        Object.values(TILED_BUTTON_PROPERTY_NAME).every((el: string) => elements.some((x) => x.name === el)),
      {
        message: `There are missing names. Required names are ${Object.values(TILED_BUTTON_PROPERTY_NAME).join(', ')}`,
      },
    ),
});
export type TiledButtonObject = z.infer<typeof TiledButtonObjectSchema>;

export const TILED_SPEAKER_PROPERTY_NAME = {
  FLIP: 'flip',
  ID: 'id',
  CURRENT_ENERGY: 'currentEnergy',
} as const;
export const TiledSpeakerPropertyEnumSchema = z.nativeEnum(TILED_SPEAKER_PROPERTY_NAME);
export type TiledSpeakerPropertyEnum = z.infer<typeof TiledSpeakerPropertyEnumSchema>;

export const TiledSpeakerObjectSchema = z.object({
  x: z.number(),
  y: z.number(),
  type: z.literal('Speaker'),
  properties: z
    .array(TiledObjectPropertySchema)
    .refine(
      (elements) =>
        Object.values(TILED_SPEAKER_PROPERTY_NAME).every((el: string) => elements.some((x) => x.name === el)),
      {
        message: `There are missing names. Required names are ${Object.values(TILED_SPEAKER_PROPERTY_NAME).join(', ')}`,
      },
    ),
});
export type TiledSpeakerObject = z.infer<typeof TiledSpeakerObjectSchema>;

export const TILED_NPC_PROPERTY_NAME = {
  ID: 'id',
} as const;
export const TiledNpcPropertyEnumSchema = z.nativeEnum(TILED_NPC_PROPERTY_NAME);
export type TiledNpcPropertyEnum = z.infer<typeof TiledNpcPropertyEnumSchema>;

export const TiledNpcObjectSchema = z.object({
  x: z.number(),
  y: z.number(),
  type: z.literal('Npc'),
  properties: z
    .array(TiledObjectPropertySchema)
    .refine(
      (elements) => Object.values(TILED_NPC_PROPERTY_NAME).every((el: string) => elements.some((x) => x.name === el)),
      {
        message: `There are missing names. Required names are ${Object.values(TILED_NPC_PROPERTY_NAME).join(', ')}`,
      },
    ),
});
export type TiledNpcObject = z.infer<typeof TiledNpcObjectSchema>;

export const TILED_ENERGY_PROPERTY_NAME = {
  CURRENT_ENERGY: 'currentEnergy',
} as const;
export const TiledEnergyPropertyEnumSchema = z.nativeEnum(TILED_ENERGY_PROPERTY_NAME);
export type TiledEnergyPropertyEnum = z.infer<typeof TiledEnergyPropertyEnumSchema>;

export const TiledEnergyObjectSchema = z.object({
  x: z.number(),
  y: z.number(),
  type: z.literal('Energy'),
  properties: z
    .array(TiledObjectPropertySchema)
    .refine(
      (elements) =>
        Object.values(TILED_ENERGY_PROPERTY_NAME).every((el: string) => elements.some((x) => x.name === el)),
      {
        message: `There are missing names. Required names are ${Object.values(TILED_ENERGY_PROPERTY_NAME).join(', ')}`,
      },
    ),
});
export type TiledEnergyObject = z.infer<typeof TiledEnergyObjectSchema>;

export const TiledExitObjectSchema = z.object({
  x: z.number(),
  y: z.number(),
  width: z.number(),
  height: z.number(),
});
export type TiledExitObject = z.infer<typeof TiledExitObjectSchema>;

export const TILED_BELT_PROPERTY_NAME = {
  ID: 'id',
} as const;
export const TiledBeltPropertyEnumSchema = z.nativeEnum(TILED_BELT_PROPERTY_NAME);
export type TiledBeltPropertyEnum = z.infer<typeof TiledBeltPropertyEnumSchema>;

export const TiledBeltObjectSchema = z.object({
  x: z.number(),
  y: z.number(),
  width: z.number(),
  type: z.literal('Belt'),
  properties: z
    .array(TiledObjectPropertySchema)
    .refine(
      (elements) => Object.values(TILED_BELT_PROPERTY_NAME).every((el: string) => elements.some((x) => x.name === el)),
      {
        message: `There are missing names. Required names are ${Object.values(TILED_BELT_PROPERTY_NAME).join(', ')}`,
      },
    ),
});
export type TiledBeltObject = z.infer<typeof TiledBeltObjectSchema>;

export const TILED_SMASHER_PROPERTY_NAME = {
  ID: 'id',
} as const;
export const TiledSmasherPropertyEnumSchema = z.nativeEnum(TILED_SMASHER_PROPERTY_NAME);
export type TiledSmasherPropertyEnum = z.infer<typeof TiledSmasherPropertyEnumSchema>;

export const TiledSmasherObjectSchema = z.object({
  x: z.number(),
  y: z.number(),
  type: z.literal('Smasher'),
  properties: z
    .array(TiledObjectPropertySchema)
    .refine(
      (elements) =>
        Object.values(TILED_SMASHER_PROPERTY_NAME).every((el: string) => elements.some((x) => x.name === el)),
      {
        message: `There are missing names. Required names are ${Object.values(TILED_SMASHER_PROPERTY_NAME).join(', ')}`,
      },
    ),
});
export type TiledSmasherObject = z.infer<typeof TiledSmasherObjectSchema>;

export const TILED_BRIDGE_PROPERTY_NAME = {
  ID: 'id',
  STOPS: 'stops',
} as const;
export const TiledBridgePropertyEnumSchema = z.nativeEnum(TILED_BRIDGE_PROPERTY_NAME);
export type TiledBridgePropertyEnum = z.infer<typeof TiledBridgePropertyEnumSchema>;

export const TiledBridgeObjectSchema = z.object({
  x: z.number(),
  y: z.number(),
  width: z.number(),
  height: z.number(),
  type: z.literal('Bridge'),
  properties: z
    .array(TiledObjectPropertySchema)
    .refine(
      (elements) =>
        Object.values(TILED_BRIDGE_PROPERTY_NAME).every((el: string) => elements.some((x) => x.name === el)),
      {
        message: `There are missing names. Required names are ${Object.values(TILED_BRIDGE_PROPERTY_NAME).join(', ')}`,
      },
    ),
});
export type TiledBridgeObject = z.infer<typeof TiledBridgeObjectSchema>;
