export type Level = number[][];
export type Board = Tile[][];
export type Match3GameState = {
  board: Board;
  numberOfBasicTileVariations: number;
};
export type Coordinate = {
  row: number;
  col: number;
};
export type PossibleMove = {
  coordinate1: Coordinate;
  coordinate2: Coordinate;
};
export type Tile = {
  type: number;
  shift: number;
};

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
export function createBoard(boardLayout: Level, numberOfBasicTileVariations: number): Match3GameState {
  const gameState: Match3GameState = {
    board: [],
    numberOfBasicTileVariations,
  };

  for (let i = 0; i < boardLayout.length; i += 1) {
    const row: Tile[] = [];
    for (let j = 0; j < boardLayout[0].length; j += 1) {
      row.push({
        type: getRandomTile(numberOfBasicTileVariations),
        shift: 0,
      });
    }
    gameState.board.push(row);
  }

  // remove any starting matches
  resolveMatches(gameState);

  // validate there is possible moves
  const possibleMoves = getPossibleMoves(gameState.board);
  console.log(`${possibleMoves.length} moves found`);
  possibleMoves.forEach((move) => console.log(move));

  return gameState;
}

export function getRandomTile(numberOfBasicTileVariations: number): number {
  return Math.floor(Math.random() * numberOfBasicTileVariations);
}

function getPossibleMoves(board: Board): PossibleMove[] {
  console.log('');
  const moves: PossibleMove[] = [];
  // Check horizontal swaps
  for (let j = 0; j < board.length; j++) {
    for (let i = 0; i < board[0].length - 1; i++) {
      console.log('horizontal check', j, i);
      // Swap, find clusters and swap back
      swapTiles(board, { col: i, row: j }, { col: i + 1, row: j });
      const matches = findMatches(board);
      console.log(matches);
      swapTiles(board, { col: i, row: j }, { col: i + 1, row: j });

      // Check if the swap made a cluster
      if (matches.length > 0) {
        // Found a move
        moves.push({
          coordinate1: { col: i, row: j },
          coordinate2: { col: i + 1, row: j },
        });
      }
    }
  }
  console.log('');
  // Check vertical swaps
  for (let i = 0; i < board[0].length; i++) {
    for (let j = 0; j < board.length - 1; j++) {
      console.log('vertical check', j, i);

      // Swap, find clusters and swap back
      swapTiles(board, { col: i, row: j }, { col: i, row: j + 1 });
      const matches = findMatches(board);
      console.log(matches);
      swapTiles(board, { col: i, row: j }, { col: i, row: j + 1 });

      // Check if the swap made a cluster
      if (matches.length > 0) {
        // Found a move
        moves.push({
          coordinate1: { col: i, row: j },
          coordinate2: { col: i, row: j + 1 },
        });
      }
    }
  }
  return moves;
}

export function findMatches(board: Board): Coordinate[] {
  const matches: Coordinate[] = [];

  for (let j = 0; j < board.length; j++) {
    for (let i = 0; i < board[0].length; i++) {
      if (
        isPartOfChain(board, {
          row: i,
          col: j,
        })
      ) {
        matches.push({
          row: i,
          col: j,
        });
      }
    }
  }

  return matches;
}

function swapTiles(board: Board, tileCoordinate1: Coordinate, tileCoordinate2: Coordinate): void {
  const tempTileType = board[tileCoordinate1.row][tileCoordinate1.col];
  board[tileCoordinate1.row][tileCoordinate1.col] = board[tileCoordinate2.row][tileCoordinate2.col];
  board[tileCoordinate2.row][tileCoordinate2.col] = tempTileType;
}

function isPartOfChain(board: Board, coordinate: Coordinate): boolean {
  const numberOfRows = board.length;
  const numberOfCols = board[0].length;
  const { row, col } = coordinate;
  const variation = board[row][col].type;

  console.log(coordinate);

  // left (only check if we are in the third column)
  if (col >= 2) {
    if (variation === board[row][col - 1].type && variation === board[row][col - 2].type) {
      return true;
    }
  }

  // right (only check if we are at least two from the last column)
  if (col <= numberOfCols - 3) {
    if (variation === board[row][col + 1].type && variation === board[row][col + 2].type) {
      return true;
    }
  }

  // up
  if (row >= 2) {
    if (variation === board[row - 1][col].type && variation === board[row - 2][col].type) {
      return true;
    }
  }

  // down
  if (row <= numberOfRows - 3) {
    if (variation === board[row + 1][col].type && variation === board[row + 2][col].type) {
      return true;
    }
  }

  // center - horizontal
  if (col >= 1 && col <= numberOfCols - 2) {
    if (variation === board[row][col - 1].type && variation === board[row][col + 1].type) {
      return true;
    }
  }

  // center - vertical
  if (row >= 1 && row <= numberOfRows - 2) {
    if (variation === board[row + 1][col].type && variation === board[row - 1][col].type) {
      return true;
    }
  }

  return false;
}

function resolveMatches(gameState: Match3GameState): void {
  // find matches
  let matches = findMatches(gameState.board);

  while (matches.length > 0) {
    // remove matches
    removeTiles(gameState.board, matches);

    // shift tiles down
    shiftTiles(gameState);

    // check to see if there are new matches
    matches = findMatches(gameState.board);
  }
}

function removeTiles(board: Board, matches: Coordinate[]): void {
  // Change the type of the tiles to -1, indicating a removed tile
  matches.forEach((match) => {
    board[match.row][match.col].type = -1;
  });

  // Calculate how much a tile should be shifted downwards
  for (let i = 0; i < board[0].length; i += 1) {
    let shift = 0;
    for (let j = board.length - 1; j >= 0; j -= 1) {
      // Loop from bottom to top
      if (board[j][i].type === -1) {
        // Tile is removed, increase shift
        shift += 1;
        board[j][i].shift = 0;
        continue;
      }

      // Set the shift
      board[j][i].shift = shift;
    }
  }
}

function shiftTiles(gameState: Match3GameState): void {
  // Shift tiles
  for (let i = 0; i < gameState.board[0].length; i += 1) {
    for (let j = gameState.board.length - 1; j >= 0; j -= 1) {
      // Loop from bottom to top
      if (gameState.board[j][i].type === -1) {
        // Insert new random tile
        gameState.board[j][i].type = getRandomTile(gameState.numberOfBasicTileVariations);
      } else {
        // Swap tile to shift it
        const shift = gameState.board[j][i].shift;
        if (shift > 0) {
          swapTiles(gameState.board, { row: j, col: i }, { row: j + shift, col: i });
        }
      }

      // Reset shift
      gameState.board[j][i].shift = 0;
    }
  }
}

export class Match3 {
  #gameState: Match3GameState;

  constructor() {
    this.#gameState = createBoard(
      [
        [1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1],
      ],
      5,
    );
  }

  get board() {
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

// https://medium.com/@rdolivo/ecs-for-gamedev-with-typescript-5a1204f594bc
