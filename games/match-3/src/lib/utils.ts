import {
  Cluster,
  CLUSTER_TYPE,
  Board,
  Level,
  Match3GameState,
  Tile,
  SPECIAL_TILE_TYPE,
  Coordinate,
  UpdatedTileLocation,
  NewTileAdded,
} from './types';

export function checkBoardForHorizontalMatches(board: Board): Cluster[] {
  const clusters: Cluster[] = [];
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length - 2; col++) {
      let matchLength = 1;
      while (
        col + matchLength < board[row].length &&
        board[row][col].type === board[row][col + matchLength].type &&
        !board[row][col + matchLength].active
      ) {
        matchLength++;
      }
      if (matchLength >= 3) {
        clusters.push({ row: row, col: col, length: matchLength, type: CLUSTER_TYPE.HORIZONTAL });
        for (let i = 0; i < matchLength; i += 1) {
          board[row][col + i].active = true;
        }
        col += matchLength - 1; // Skip over the matched tiles
      }
    }
  }
  return clusters;
}

export function checkBoardForVerticalMatches(board: Board): Cluster[] {
  const clusters: Cluster[] = [];
  for (let col = 0; col < board[0].length; col++) {
    for (let row = 0; row < board.length - 2; row++) {
      let matchLength = 1;
      while (
        row + matchLength < board.length &&
        board[row][col].type === board[row + matchLength][col].type &&
        !board[row + matchLength][col].active
      ) {
        matchLength++;
      }
      if (matchLength >= 3) {
        clusters.push({ row: row, col: col, length: matchLength, type: CLUSTER_TYPE.VERTICAL });
        for (let i = 0; i < matchLength; i += 1) {
          board[row + i][col].active = true;
        }
        row += matchLength - 1; // Skip over the matched tiles
      }
    }
  }
  return clusters;
}

export function getRandomTile(numberOfBasicTileVariations: number): number {
  return Math.floor(Math.random() * numberOfBasicTileVariations);
}

/**
 * Creates and initializes a new Match 3 game board based on the level
 * layout that is provided. The level layout should be a 2D array filled
 * with a 0s and 1s. The 0s represent gaps in that row/column while a 1
 * represent a space that should have a game time.
 *
 * For example, to create a 3 x 3 grid, you would pass an array like:
 * [[1,1,1],[1,1,1],[1,1,1]]
 *
 * If you want to provide a level like:
 * X   X   X
 * X X X X X
 * X   X   X
 * where the X represents a game piece, you would pass:
 * [[1,0,1,0,1],[1,1,1,1,1],[1,0,1,0,1]]
 *
 * @param {Board} boardLayout layout of the board to be created
 * @returns {Board}
 */
export function createMatch3GameState(boardLayout: Level, numberOfBasicTileVariations: number): Match3GameState {
  if (numberOfBasicTileVariations <= 1) {
    throw new Error('Invalid game config');
  }

  const gameState: Match3GameState = {
    board: [],
    numberOfBasicTileVariations,
  };

  for (let i = 0; i < boardLayout.length; i += 1) {
    const row: Tile[] = [];
    for (let j = 0; j < boardLayout[0].length; j += 1) {
      row.push({
        type: getRandomTile(numberOfBasicTileVariations),
        specialTileType: SPECIAL_TILE_TYPE.NONE,
        active: false,
      });
    }
    gameState.board.push(row);
  }

  // remove any starting matches
  console.log('');
  findAllMatches(gameState.board);
  while (isActiveTilesOnBoard(gameState.board)) {
    removeAllActiveTilesFromBoard(gameState.board);
    shiftTiles(gameState.board);
  }
  // TODO

  // validate there is possible moves
  // TODO

  return gameState;
}

export function isActiveTilesOnBoard(board: Board): boolean {
  return board.some((row) => {
    return row.some((tile) => tile.active);
  });
}

export function findAllMatches(board: Board): Cluster[] {
  const horizontalMatches = checkBoardForHorizontalMatches(board);
  const verticalMatches = checkBoardForVerticalMatches(board);
  return horizontalMatches.concat(verticalMatches);
}

export function resolveActiveTiles(board: Board): void {
  // get all active tiles from the board and add to a queue and map
  // for each tile in queue, active the tile based on type, and add new tiles if needed
  // repeat until queue is empty, that way all tiles that need to be removed will be
}

export function createSpecialTilesFromMatchClusters(gameState: Match3GameState): void {
  // TODO
  // after tile swap, or activate special tile
  // find all of the match clusters
  // for all active tiles, resolve their action
  // after all tiles have been activated, create special tiles from match clusters if needed
  //   - make sure to reset the active field and set the special type field
  // remove all active tiles from board
  // shift all tiles down on the board
  // this would all be 1 chain, so in a chain we need to return:
  //   - the tiles that get removed from being active
  //   - the tiles that were transformed because of being special
  //   - the new tiles that get added and shifted down the board
  // we would repeat all of this until all chains are finished, and no matches found
}

export function removeAllActiveTilesFromBoard(board: Board): Coordinate[] {
  const removedTiles: Coordinate[] = [];
  for (let i = 0; i < board.length; i += 1) {
    for (let j = 0; j < board[0].length; j += 1) {
      if (board[i][j].active) {
        board[i][j] = {
          active: false,
          type: -1,
          specialTileType: SPECIAL_TILE_TYPE.NONE,
        };
        removedTiles.push({ row: i, col: j });
      }
    }
  }
  return removedTiles;
}

export function shiftTiles(board: Board): UpdatedTileLocation[] {
  const shiftedTiles: UpdatedTileLocation[] = [];
  for (let i = 0; i < board[0].length; i += 1) {
    let shift = 0;
    for (let j = board.length - 1; j >= 0; j -= 1) {
      // Loop from bottom to top
      if (board[j][i].type === -1) {
        // Tile is removed, increase shift
        shift += 1;
        continue;
      }
      if (shift === 0) {
        continue;
      }

      // shift tile down
      swapTiles(board, { row: j, col: i }, { row: j + shift, col: i });
      shiftedTiles.push({
        previousPosition: { row: j, col: i },
        newPosition: { row: j + shift, col: i },
      });
    }
  }
  return shiftedTiles;
}

export function swapTiles(board: Board, tileCoordinate1: Coordinate, tileCoordinate2: Coordinate): void {
  const tempTileType = board[tileCoordinate1.row][tileCoordinate1.col];
  board[tileCoordinate1.row][tileCoordinate1.col] = board[tileCoordinate2.row][tileCoordinate2.col];
  board[tileCoordinate2.row][tileCoordinate2.col] = tempTileType;
}

export function refillTiles(board: Board, tileVariations: number): NewTileAdded[] {
  const tilesAdded: NewTileAdded[] = [];
  // start filling board from top to bottom
  for (let i = 0; i < board[0].length; i += 1) {
    for (let j = 0; j < board.length; j += 1) {
      // if space is empty we need to process next in column
      if (board[j][i].type !== -1) {
        j += board.length;
        continue;
      }
      // pick random piece
      board[j][i].type = getRandomTile(tileVariations);
      tilesAdded.push({
        tile: board[j][i],
        position: {
          col: i,
          row: j,
        },
      });
    }
  }
  return tilesAdded;
}

export function printBoard(board: Board): void {
  let prettyString = '';

  // print main grid
  for (let i = 0; i < board.length; i++) {
    prettyString += '\n';
    for (let j = 0; j < board[0].length; j++) {
      prettyString += ` ${board[i][j].type}`;
    }
  }

  console.log(prettyString);
}
