export const SPECIAL_TILE_TYPE = {
  NONE: 'NONE',
  VERTICAL_BOMB: 'VERTICAL_BOMB',
  HORIZONTAL_BOMB: 'HORIZONTAL_BOMB',
  COLOR_BOMB: 'COLOR_BOMB',
  CROSS_BOMB: 'CROSS_BOMB',
} as const;
export type SpecialTileType = keyof typeof SPECIAL_TILE_TYPE;
export const CLUSTER_TYPE = {
  HORIZONTAL: 'HORIZONTAL',
  VERTICAL: 'VERTICAL',
  T_SHAPE: 'T_SHAPE',
  L_SHAPE: 'L_SHAPE',
} as const;
export type ClusterType = keyof typeof CLUSTER_TYPE;
export type Level = number[][];
export type Board = Tile[][];
export type Cluster = {
  row: number;
  col: number;
  length: number;
  type: ClusterType;
};
// -1 = VERTICAL_BOMB
// -2 = HORIZONTAL_BOMB
// -3 = COLOR_BOMB
// -4 = CROSS_BOMB
//  0 = empty space
// any other number represents a basic tile
export type Tile = {
  type: number;
  specialTileType: SpecialTileType;
  active: boolean;
};
export type Match3GameState = {
  board: Board;
  numberOfBasicTileVariations: number;
};
export type Coordinate = {
  row: number;
  col: number;
};

export type UpdatedTileLocation = {
  previousPosition: Coordinate;
  newPosition: Coordinate;
};
export type NewTileAdded = {
  tile: Tile;
  position: Coordinate;
};
export type PossibleMove = {
  coordinate1: Coordinate;
  coordinate2: Coordinate;
};
