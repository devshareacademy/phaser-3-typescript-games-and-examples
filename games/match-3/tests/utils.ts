import * as uvu from 'uvu';
import * as assert from 'uvu/assert';
import seedrandom from 'seedrandom';
import { Match3Utils, Match3Types } from '../src/lib';
import { SPECIAL_TILE_TYPE } from '../src/lib/types';

function generateBoard(layout: number[][]): Match3Types.Board {
  const board: Match3Types.Board = [];
  for (let i = 0; i < layout.length; i += 1) {
    const row: Match3Types.Tile[] = [];
    for (let j = 0; j < layout[0].length; j += 1) {
      row.push({ type: layout[i][j], specialTileType: 'NONE', active: false });
    }
    board.push(row);
  }
  return board;
}

function createMatch3GameStateTests(): void {
  const suite = uvu.suite('Generate Board');

  suite.before.each(() => {
    const seed = 'f96d18a4-ebca-4241-8109-f543cafba0ed';
    seedrandom(seed, { global: true });
  });

  suite('should create a board based on the provided level', () => {
    const level = [
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
    ];
    const gameState = Match3Utils.createMatch3GameState(level, 2);
    console.log('');
    Match3Utils.printBoard(gameState.board);
    console.log(gameState.numberOfBasicTileVariations);

    assert.type(gameState, 'object');
    assert.type(gameState.numberOfBasicTileVariations, 'number');
    assert.equal(gameState.numberOfBasicTileVariations, 2);
  });

  suite.run();
}

function checkBoardForHorizontalMatchesTests(): void {
  const suite = uvu.suite('checkBoardForHorizontalMatches');

  suite('should return no match clusters if there are no horizontal matches on the board', () => {
    const layout = [
      [0, 1, 0],
      [1, 0, 1],
      [0, 1, 0],
    ];
    const board = generateBoard(layout);
    const results = Match3Utils.checkBoardForHorizontalMatches(board);

    assert.type(results, 'object');
    assert.equal(results.length, 0);
  });

  suite('should return 1 cluster for a horizontal match 1', () => {
    const layout = [
      [1, 1, 1],
      [1, 0, 1],
      [0, 1, 0],
    ];
    const board = generateBoard(layout);
    const results = Match3Utils.checkBoardForHorizontalMatches(board);

    assert.type(results, 'object');
    assert.equal(results.length, 1);
    assert.equal(results[0].col, 0);
    assert.equal(results[0].row, 0);
    assert.equal(results[0].length, 3);
    assert.equal(results[0].type, Match3Types.CLUSTER_TYPE.HORIZONTAL);

    // validate board state
    const matches = ['0:0', '0:1', '0:2'];
    for (let i = 0; i < layout.length; i += 1) {
      for (let j = 0; j < layout[0].length; j += 1) {
        if (matches.includes(`${i}:${j}`)) {
          assert.equal(board[i][j].active, true);
        } else {
          assert.equal(board[i][j].active, false);
        }
      }
    }
  });

  suite('should return 1 cluster for a horizontal match 2', () => {
    const layout = [
      [1, 0, 1],
      [1, 1, 1],
      [0, 1, 0],
    ];
    const board = generateBoard(layout);
    const results = Match3Utils.checkBoardForHorizontalMatches(board);

    assert.type(results, 'object');
    assert.equal(results.length, 1);
    assert.equal(results[0].col, 0);
    assert.equal(results[0].row, 1);
    assert.equal(results[0].length, 3);
    assert.equal(results[0].type, Match3Types.CLUSTER_TYPE.HORIZONTAL);

    // validate board state
    const matches = ['1:0', '1:1', '1:2'];
    for (let i = 0; i < layout.length; i += 1) {
      for (let j = 0; j < layout[0].length; j += 1) {
        if (matches.includes(`${i}:${j}`)) {
          assert.equal(board[i][j].active, true);
        } else {
          assert.equal(board[i][j].active, false);
        }
      }
    }
  });

  suite('should return 1 cluster for a horizontal match 3', () => {
    const layout = [
      [1, 0, 1],
      [0, 1, 0],
      [1, 1, 1],
    ];
    const board = generateBoard(layout);
    const results = Match3Utils.checkBoardForHorizontalMatches(board);

    assert.type(results, 'object');
    assert.equal(results.length, 1);
    assert.equal(results[0].col, 0);
    assert.equal(results[0].row, 2);
    assert.equal(results[0].length, 3);
    assert.equal(results[0].type, Match3Types.CLUSTER_TYPE.HORIZONTAL);

    // validate board state
    const matches = ['2:0', '2:1', '2:2'];
    for (let i = 0; i < layout.length; i += 1) {
      for (let j = 0; j < layout[0].length; j += 1) {
        if (matches.includes(`${i}:${j}`)) {
          assert.equal(board[i][j].active, true);
        } else {
          assert.equal(board[i][j].active, false);
        }
      }
    }
  });

  suite('should return multiple clusters', () => {
    const layout = [
      [1, 1, 1],
      [0, 1, 0],
      [1, 1, 1],
    ];
    const board = generateBoard(layout);
    const results = Match3Utils.checkBoardForHorizontalMatches(board);

    assert.type(results, 'object');
    assert.equal(results.length, 2);
    assert.equal(results[0].col, 0);
    assert.equal(results[0].row, 0);
    assert.equal(results[0].length, 3);
    assert.equal(results[0].type, Match3Types.CLUSTER_TYPE.HORIZONTAL);
    assert.equal(results[1].col, 0);
    assert.equal(results[1].row, 2);
    assert.equal(results[1].length, 3);
    assert.equal(results[1].type, Match3Types.CLUSTER_TYPE.HORIZONTAL);

    // validate board state
    const matches = ['0:0', '0:1', '0:2', '2:0', '2:1', '2:2'];
    for (let i = 0; i < layout.length; i += 1) {
      for (let j = 0; j < layout[0].length; j += 1) {
        if (matches.includes(`${i}:${j}`)) {
          assert.equal(board[i][j].active, true);
        } else {
          assert.equal(board[i][j].active, false);
        }
      }
    }
  });

  suite('should return only matched tiles in a horizontal cluster', () => {
    const layout = [
      [1, 0, 1, 0, 1],
      [0, 1, 0, 1, 0],
      [1, 1, 1, 0, 1],
    ];
    const board = generateBoard(layout);
    const results = Match3Utils.checkBoardForHorizontalMatches(board);

    assert.type(results, 'object');
    assert.equal(results.length, 1);
    assert.equal(results[0].col, 0);
    assert.equal(results[0].row, 2);
    assert.equal(results[0].length, 3);
    assert.equal(results[0].type, Match3Types.CLUSTER_TYPE.HORIZONTAL);

    // validate board state
    const matches = ['2:0', '2:1', '2:2'];
    for (let i = 0; i < layout.length; i += 1) {
      for (let j = 0; j < layout[0].length; j += 1) {
        if (matches.includes(`${i}:${j}`)) {
          assert.equal(board[i][j].active, true);
        } else {
          assert.equal(board[i][j].active, false);
        }
      }
    }
  });

  suite('should return matches of length 4', () => {
    const layout = [
      [1, 0, 1, 0, 1],
      [0, 1, 0, 1, 0],
      [1, 1, 1, 1, 0],
    ];
    const board = generateBoard(layout);
    const results = Match3Utils.checkBoardForHorizontalMatches(board);

    assert.type(results, 'object');
    assert.equal(results.length, 1);
    assert.equal(results[0].col, 0);
    assert.equal(results[0].row, 2);
    assert.equal(results[0].length, 4);
    assert.equal(results[0].type, Match3Types.CLUSTER_TYPE.HORIZONTAL);

    // validate board state
    const matches = ['2:0', '2:1', '2:2', '2:3'];
    for (let i = 0; i < layout.length; i += 1) {
      for (let j = 0; j < layout[0].length; j += 1) {
        if (matches.includes(`${i}:${j}`)) {
          assert.equal(board[i][j].active, true);
        } else {
          assert.equal(board[i][j].active, false);
        }
      }
    }
  });

  suite('should return matches of length 5', () => {
    const layout = [
      [1, 0, 1, 0, 1],
      [0, 1, 0, 1, 0],
      [1, 1, 1, 1, 1],
    ];
    const board = generateBoard(layout);
    const results = Match3Utils.checkBoardForHorizontalMatches(board);

    assert.type(results, 'object');
    assert.equal(results.length, 1);
    assert.equal(results[0].col, 0);
    assert.equal(results[0].row, 2);
    assert.equal(results[0].length, 5);
    assert.equal(results[0].type, Match3Types.CLUSTER_TYPE.HORIZONTAL);

    // validate board state
    const matches = ['2:0', '2:1', '2:2', '2:3', '2:4'];
    for (let i = 0; i < layout.length; i += 1) {
      for (let j = 0; j < layout[0].length; j += 1) {
        if (matches.includes(`${i}:${j}`)) {
          assert.equal(board[i][j].active, true);
        } else {
          assert.equal(board[i][j].active, false);
        }
      }
    }
  });

  suite('should not return matches if tile is already active', () => {
    const layout = [
      [0, 2, 0],
      [1, 1, 1],
      [0, 1, 0],
    ];
    const board = generateBoard(layout);
    board[1][2].active = true;
    const results = Match3Utils.checkBoardForHorizontalMatches(board);

    assert.type(results, 'object');
    assert.equal(results.length, 0);
  });

  suite.run();
}

function checkBoardForVerticalMatchesTests(): void {
  const suite = uvu.suite('checkBoardForVerticalMatches');

  suite('should return no match clusters if there are no vertical matches on the board', () => {
    const layout = [
      [0, 1, 0],
      [1, 0, 1],
      [0, 1, 0],
    ];
    const board = generateBoard(layout);
    const results = Match3Utils.checkBoardForVerticalMatches(board);

    assert.type(results, 'object');
    assert.equal(results.length, 0);
  });

  suite('should return 1 cluster for a vertical match 1', () => {
    const layout = [
      [1, 0, 1],
      [1, 0, 1],
      [1, 1, 0],
    ];
    const board = generateBoard(layout);
    const results = Match3Utils.checkBoardForVerticalMatches(board);

    assert.type(results, 'object');
    assert.equal(results.length, 1);
    assert.equal(results[0].col, 0);
    assert.equal(results[0].row, 0);
    assert.equal(results[0].length, 3);
    assert.equal(results[0].type, Match3Types.CLUSTER_TYPE.VERTICAL);

    // validate board state
    const matches = ['0:0', '1:0', '2:0'];
    for (let i = 0; i < layout.length; i += 1) {
      for (let j = 0; j < layout[0].length; j += 1) {
        if (matches.includes(`${i}:${j}`)) {
          assert.equal(board[i][j].active, true);
        } else {
          assert.equal(board[i][j].active, false);
        }
      }
    }
  });

  suite('should return 1 cluster for a vertical match 2', () => {
    const layout = [
      [1, 1, 1],
      [0, 1, 1],
      [1, 1, 0],
    ];
    const board = generateBoard(layout);
    const results = Match3Utils.checkBoardForVerticalMatches(board);

    assert.type(results, 'object');
    assert.equal(results.length, 1);
    assert.equal(results[0].col, 1);
    assert.equal(results[0].row, 0);
    assert.equal(results[0].length, 3);
    assert.equal(results[0].type, Match3Types.CLUSTER_TYPE.VERTICAL);

    // validate board state
    const matches = ['0:1', '1:1', '2:1'];
    for (let i = 0; i < layout.length; i += 1) {
      for (let j = 0; j < layout[0].length; j += 1) {
        if (matches.includes(`${i}:${j}`)) {
          assert.equal(board[i][j].active, true);
        } else {
          assert.equal(board[i][j].active, false);
        }
      }
    }
  });

  suite('should return 1 cluster for a vertical match 3', () => {
    const layout = [
      [0, 1, 1],
      [0, 0, 1],
      [1, 0, 1],
    ];
    const board = generateBoard(layout);
    const results = Match3Utils.checkBoardForVerticalMatches(board);

    assert.type(results, 'object');
    assert.equal(results.length, 1);
    assert.equal(results[0].col, 2);
    assert.equal(results[0].row, 0);
    assert.equal(results[0].length, 3);
    assert.equal(results[0].type, Match3Types.CLUSTER_TYPE.VERTICAL);

    // validate board state
    const matches = ['0:2', '1:2', '2:2'];
    for (let i = 0; i < layout.length; i += 1) {
      for (let j = 0; j < layout[0].length; j += 1) {
        if (matches.includes(`${i}:${j}`)) {
          assert.equal(board[i][j].active, true);
        } else {
          assert.equal(board[i][j].active, false);
        }
      }
    }
  });

  suite('should return multiple clusters', () => {
    const layout = [
      [1, 2, 1],
      [1, 0, 1],
      [1, 0, 1],
    ];
    const board = generateBoard(layout);
    const results = Match3Utils.checkBoardForVerticalMatches(board);

    assert.type(results, 'object');
    assert.equal(results.length, 2);
    assert.equal(results[0].col, 0);
    assert.equal(results[0].row, 0);
    assert.equal(results[0].length, 3);
    assert.equal(results[0].type, Match3Types.CLUSTER_TYPE.VERTICAL);
    assert.equal(results[1].col, 2);
    assert.equal(results[1].row, 0);
    assert.equal(results[1].length, 3);
    assert.equal(results[1].type, Match3Types.CLUSTER_TYPE.VERTICAL);

    // validate board state
    const matches = ['0:0', '1:0', '2:0', '0:2', '1:2', '2:2'];
    for (let i = 0; i < layout.length; i += 1) {
      for (let j = 0; j < layout[0].length; j += 1) {
        if (matches.includes(`${i}:${j}`)) {
          assert.equal(board[i][j].active, true);
        } else {
          assert.equal(board[i][j].active, false);
        }
      }
    }
  });

  suite('should return only matched tiles in a vertical cluster', () => {
    const layout = [
      [0, 1, 1],
      [0, 0, 1],
      [1, 0, 1],
      [0, 1, 0],
      [1, 0, 1],
    ];
    const board = generateBoard(layout);
    const results = Match3Utils.checkBoardForVerticalMatches(board);

    assert.type(results, 'object');
    assert.equal(results.length, 1);
    assert.equal(results[0].col, 2);
    assert.equal(results[0].row, 0);
    assert.equal(results[0].length, 3);
    assert.equal(results[0].type, Match3Types.CLUSTER_TYPE.VERTICAL);

    // validate board state
    const matches = ['0:2', '1:2', '2:2'];
    for (let i = 0; i < layout.length; i += 1) {
      for (let j = 0; j < layout[0].length; j += 1) {
        if (matches.includes(`${i}:${j}`)) {
          assert.equal(board[i][j].active, true);
        } else {
          assert.equal(board[i][j].active, false);
        }
      }
    }
  });

  suite('should return matches of length 4', () => {
    const layout = [
      [0, 1, 1],
      [0, 0, 1],
      [1, 0, 1],
      [0, 1, 1],
      [1, 0, 0],
    ];
    const board = generateBoard(layout);
    const results = Match3Utils.checkBoardForVerticalMatches(board);

    assert.type(results, 'object');
    assert.equal(results.length, 1);
    assert.equal(results[0].col, 2);
    assert.equal(results[0].row, 0);
    assert.equal(results[0].length, 4);
    assert.equal(results[0].type, Match3Types.CLUSTER_TYPE.VERTICAL);

    // validate board state
    const matches = ['0:2', '1:2', '2:2', '3:2'];
    for (let i = 0; i < layout.length; i += 1) {
      for (let j = 0; j < layout[0].length; j += 1) {
        if (matches.includes(`${i}:${j}`)) {
          assert.equal(board[i][j].active, true);
        } else {
          assert.equal(board[i][j].active, false);
        }
      }
    }
  });

  suite('should return matches of length 5', () => {
    const layout = [
      [0, 1, 1],
      [0, 0, 1],
      [1, 0, 1],
      [0, 1, 1],
      [1, 0, 1],
    ];
    const board = generateBoard(layout);
    const results = Match3Utils.checkBoardForVerticalMatches(board);

    assert.type(results, 'object');
    assert.equal(results.length, 1);
    assert.equal(results[0].col, 2);
    assert.equal(results[0].row, 0);
    assert.equal(results[0].length, 5);
    assert.equal(results[0].type, Match3Types.CLUSTER_TYPE.VERTICAL);

    // validate board state
    const matches = ['0:2', '1:2', '2:2', '3:2', '4:2'];
    for (let i = 0; i < layout.length; i += 1) {
      for (let j = 0; j < layout[0].length; j += 1) {
        if (matches.includes(`${i}:${j}`)) {
          assert.equal(board[i][j].active, true);
        } else {
          assert.equal(board[i][j].active, false);
        }
      }
    }
  });

  suite('should not return matches if tile is already active', () => {
    const layout = [
      [1, 1, 0],
      [1, 0, 1],
      [1, 1, 0],
    ];
    const board = generateBoard(layout);
    board[2][0].active = true;
    const results = Match3Utils.checkBoardForHorizontalMatches(board);

    assert.type(results, 'object');
    assert.equal(results.length, 0);
  });

  suite.run();
}

function shiftTilesTests(): void {
  const suite = uvu.suite('shiftTiles');

  suite('it should not modify the board state if no tiles are missing', () => {
    const layout = [
      [0, 1, 0],
      [1, 0, 1],
      [0, 1, 0],
    ];
    const board = generateBoard(layout);
    const results = Match3Utils.shiftTiles(board);

    assert.type(results, 'object');
    assert.equal(results.length, 0);
    for (let i = 0; i < layout.length; i += 1) {
      for (let j = 0; j < layout[0].length; j += 1) {
        assert.equal(board[i][j].type, layout[i][j]);
      }
    }
  });

  suite('it should shift tiles down in the grid to fill empty spaces 1', () => {
    const layout = [
      [1, 1, -1],
      [1, -1, 1],
      [-1, -1, -1],
    ];
    const board = generateBoard(layout);
    const results = Match3Utils.shiftTiles(board);
    assert.type(results, 'object');
    assert.equal(results.length, 4);
    assert.equal(results, [
      {
        previousPosition: { row: 1, col: 0 },
        newPosition: { row: 2, col: 0 },
      },
      {
        previousPosition: { row: 0, col: 0 },
        newPosition: { row: 1, col: 0 },
      },
      {
        previousPosition: { row: 0, col: 1 },
        newPosition: { row: 2, col: 1 },
      },
      {
        previousPosition: { row: 1, col: 2 },
        newPosition: { row: 2, col: 2 },
      },
    ]);

    const expectedBoard = [
      [-1, -1, -1],
      [1, -1, -1],
      [1, 1, 1],
    ];
    for (let i = 0; i < layout.length; i += 1) {
      for (let j = 0; j < layout[0].length; j += 1) {
        assert.equal(board[i][j].type, expectedBoard[i][j]);
      }
    }
  });

  suite('it should shift tiles down in the grid to fill empty spaces 2', () => {
    const layout = [
      [1, 1, 1],
      [-1, -1, -1],
      [1, 1, 1],
    ];
    const board = generateBoard(layout);
    const results = Match3Utils.shiftTiles(board);
    assert.type(results, 'object');
    assert.equal(results.length, 3);
    assert.equal(results, [
      {
        previousPosition: { row: 0, col: 0 },
        newPosition: { row: 1, col: 0 },
      },
      {
        previousPosition: { row: 0, col: 1 },
        newPosition: { row: 1, col: 1 },
      },
      {
        previousPosition: { row: 0, col: 2 },
        newPosition: { row: 1, col: 2 },
      },
    ]);
    const expectedBoard = [
      [-1, -1, -1],
      [1, 1, 1],
      [1, 1, 1],
    ];
    for (let i = 0; i < layout.length; i += 1) {
      for (let j = 0; j < layout[0].length; j += 1) {
        assert.equal(board[i][j].type, expectedBoard[i][j]);
      }
    }
  });

  suite('it should shift tiles down in the grid to fill empty spaces 3', () => {
    const layout = [[1], [-1], [1], [-1], [-1], [-1], [1]];
    const board = generateBoard(layout);
    const results = Match3Utils.shiftTiles(board);

    assert.type(results, 'object');
    assert.equal(results.length, 2);
    assert.equal(results, [
      {
        previousPosition: { row: 2, col: 0 },
        newPosition: { row: 5, col: 0 },
      },
      {
        previousPosition: { row: 0, col: 0 },
        newPosition: { row: 4, col: 0 },
      },
    ]);
    const expectedBoard = [[-1], [-1], [-1], [-1], [1], [1], [1]];
    for (let i = 0; i < layout.length; i += 1) {
      for (let j = 0; j < layout[0].length; j += 1) {
        assert.equal(board[i][j].type, expectedBoard[i][j]);
      }
    }
  });

  suite.run();
}

function removeAllActiveTilesFromBoardTests(): void {
  const suite = uvu.suite('removeAllActiveTilesFromBoard');

  suite('it should not modify the board state if no tiles are active', () => {
    const layout = [
      [0, 1, 0],
      [1, 0, 1],
      [0, 1, 0],
    ];
    const board = generateBoard(layout);
    const results = Match3Utils.removeAllActiveTilesFromBoard(board);

    assert.type(results, 'object');
    assert.equal(results.length, 0);
    for (let i = 0; i < layout.length; i += 1) {
      for (let j = 0; j < layout[0].length; j += 1) {
        assert.equal(board[i][j].type, layout[i][j]);
      }
    }
  });

  suite('it should remove all active tiles 1', () => {
    const layout = [
      [0, 1, 0],
      [1, 0, 1],
      [0, 1, 0],
    ];
    const board = generateBoard(layout);
    const activeTiles = ['0:0', '0:1', '0:2'];
    activeTiles.forEach((val) => {
      const pos = val.split(':');
      board[parseInt(pos[0], 10)][parseInt(pos[1], 10)].active = true;
    });

    const results = Match3Utils.removeAllActiveTilesFromBoard(board);
    assert.type(results, 'object');
    assert.equal(results.length, 3);
    for (let i = 0; i < layout.length; i += 1) {
      for (let j = 0; j < layout[0].length; j += 1) {
        const tile = board[i][j];
        assert.equal(tile.active, false);
        assert.equal(tile.specialTileType, SPECIAL_TILE_TYPE.NONE);
        if (activeTiles.includes(`${i}:${j}`)) {
          assert.equal(board[i][j].type, -1);
        } else {
          assert.equal(board[i][j].type, layout[i][j]);
        }
      }
    }
  });

  suite.run();
}

function refillTilesTests(): void {
  const suite = uvu.suite('removeAllActiveTilesFromBoard');

  suite.before.each(() => {
    const seed = 'f96d18a4-ebca-4241-8109-f543cafba0ed';
    seedrandom(seed, { global: true });
  });

  suite('it should not modify the board state if there are no empty tiles', () => {
    const layout = [
      [4, 5, 4],
      [5, 4, 5],
      [4, 5, 4],
    ];
    const board = generateBoard(layout);
    const results = Match3Utils.refillTiles(board, 2);

    assert.type(results, 'object');
    assert.equal(results.length, 0);
    for (let i = 0; i < layout.length; i += 1) {
      for (let j = 0; j < layout[0].length; j += 1) {
        assert.equal(board[i][j].type, layout[i][j]);
      }
    }
  });

  suite('it should add new tiles to the board 1', () => {
    const layout = [
      [4, -1, 4],
      [5, 4, 5],
      [4, 5, 4],
    ];
    const board = generateBoard(layout);
    const results = Match3Utils.refillTiles(board, 2);

    assert.type(results, 'object');
    assert.equal(results.length, 1);

    const expectedLayout = [
      [4, 1, 4],
      [5, 4, 5],
      [4, 5, 4],
    ];
    for (let i = 0; i < expectedLayout.length; i += 1) {
      for (let j = 0; j < expectedLayout[0].length; j += 1) {
        assert.equal(board[i][j].type, expectedLayout[i][j]);
      }
    }
  });

  suite('it should add new tiles to the board 2', () => {
    const layout = [
      [4, -1, -1],
      [5, 4, -1],
      [4, 5, 4],
    ];
    const board = generateBoard(layout);
    const results = Match3Utils.refillTiles(board, 2);

    assert.type(results, 'object');
    assert.equal(results.length, 3);

    const expectedLayout = [
      [4, 1, 0],
      [5, 4, 0],
      [4, 5, 4],
    ];
    for (let i = 0; i < expectedLayout.length; i += 1) {
      for (let j = 0; j < expectedLayout[0].length; j += 1) {
        assert.equal(board[i][j].type, expectedLayout[i][j]);
      }
    }
  });

  suite('it should add new tiles to the board 2', () => {
    const layout = [
      [-1, -1, -1],
      [5, 4, -1],
      [4, 5, -1],
    ];
    const board = generateBoard(layout);
    const results = Match3Utils.refillTiles(board, 2);

    assert.type(results, 'object');
    assert.equal(results.length, 5);

    const expectedLayout = [
      [1, 0, 0],
      [5, 4, 0],
      [4, 5, 0],
    ];
    for (let i = 0; i < expectedLayout.length; i += 1) {
      for (let j = 0; j < expectedLayout[0].length; j += 1) {
        assert.equal(board[i][j].type, expectedLayout[i][j]);
      }
    }
  });

  suite('it should add new tiles to the board 3', () => {
    const layout = [
      [-1, -1, -1],
      [5, 4, -1],
      [4, 5, -1],
    ];
    const board = generateBoard(layout);
    const results = Match3Utils.refillTiles(board, 4);

    assert.type(results, 'object');
    assert.equal(results.length, 5);

    const expectedLayout = [
      [2, 0, 1],
      [5, 4, 0],
      [4, 5, 1],
    ];
    for (let i = 0; i < expectedLayout.length; i += 1) {
      for (let j = 0; j < expectedLayout[0].length; j += 1) {
        assert.equal(board[i][j].type, expectedLayout[i][j]);
      }
    }
  });

  suite.run();
}

//createMatch3GameStateTests();
checkBoardForHorizontalMatchesTests();
checkBoardForVerticalMatchesTests();
shiftTilesTests();
removeAllActiveTilesFromBoardTests();
refillTilesTests();
