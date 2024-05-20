import { Board, Coordinate, Level, Match3GameState } from './types';
import { createMatch3GameState } from './utils';

export type Match3GameConfig = {
  level: Level;
  basicTileVariations: number;
};

export class Match3 {
  #gameState: Match3GameState;

  constructor(config: Match3GameConfig) {
    this.#gameState = createMatch3GameState(config.level, config.basicTileVariations);
  }

  get board(): Board {
    return this.#gameState.board;
  }

  public activateTile(coordinate: Coordinate): void {
    // if basic, we keep track of tile so we can swap on next tile click
    // if special, do logic of tile
    // if this is the 2nd tile, check if orthogonally adjacent to first tile, if not set as the prev tile
    // check the tile type and do logic
    // return list of tiles that need to be removed
    // return list of tiles that need to be moved
    // return list of active tiles
  }

  public swapTile(coordinate1: Coordinate, coordinate2: Coordinate): void {
    // validate two tiles are orthogonally adjacent
    // swap two tiles and see if there are matches
    // if no matches, swap back
    // return list of tiles that need to be removed
    // return list of tiles that need to be moved
    // return list of active tiles
  }
}
