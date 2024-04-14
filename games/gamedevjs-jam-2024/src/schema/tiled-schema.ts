import { z } from 'zod';

const TILED_DOOR_STATE = {
  CLOSED: 'CLOSED',
  OPEN: 'OPEN',
} as const;
export const TiledDoorStateEnumSchema = z.nativeEnum(TILED_DOOR_STATE);
export type TiledDoorStateEnum = z.infer<typeof TiledDoorStateEnumSchema>;

export const TiledDoorObjectStatePropertySchema = z.object({
  name: z.literal('state'),
  type: z.literal('string'),
  propertytype: z.literal('DoorState'),
  value: TiledDoorStateEnumSchema,
});

export const TiledObjectFlipPropertySchema = z.object({
  name: z.literal('flip'),
  type: z.literal('bool'),
  value: z.boolean(),
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

export const TILED_DOOR_PROPERTY_NAME = {
  FLIP: 'flip',
  ID: 'id',
  STATE: 'state',
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
