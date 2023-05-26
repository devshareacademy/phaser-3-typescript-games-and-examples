type Cell = 'X' | 'O' | '';
enum Player {
  X = 'X',
  O = 'O',
}
type GameWinner = undefined | 'X' | 'O' | 'DRAW';

export default class TicTacToe {
  #board: Cell[][] = [];
  #currentPlayerTurn: Player = Player.X;
  #gameWinner: GameWinner = undefined;
  #isGameOver = false;

  constructor() {
    this.#initializeBoard();
  }

  get currentPlayerTurn(): Player {
    return this.#currentPlayerTurn;
  }

  get isGameOver(): boolean {
    return this.#isGameOver;
  }

  get gameWinner(): GameWinner {
    return this.#gameWinner;
  }

  public makeMove(x: number, y: number): void {
    if (this.#board[x][y] !== '') {
      return;
    }

    if (this.#currentPlayerTurn === Player.O) {
      this.#board[x][y] = Player.O;
    } else {
      this.#board[x][y] = Player.X;
    }
    if (this.#currentPlayerTurn === Player.O) {
      this.#currentPlayerTurn = Player.X;
    } else {
      this.#currentPlayerTurn = Player.O;
    }

    this.#checkForGameEnd();
  }

  #checkForGameEnd(): void {
    if (
      this.#board[0][0] !== '' &&
      this.#board[0][0] === this.#board[0][1] &&
      this.#board[0][0] === this.#board[0][2]
    ) {
      this.#gameWinner = this.#board[0][0];
    } else if (
      this.#board[1][0] !== '' &&
      this.#board[1][0] === this.#board[1][1] &&
      this.#board[1][0] === this.#board[1][2]
    ) {
      this.#gameWinner = this.#board[1][0];
    } else if (
      this.#board[2][0] !== '' &&
      this.#board[2][0] === this.#board[2][1] &&
      this.#board[2][0] === this.#board[2][2]
    ) {
      this.#gameWinner = this.#board[2][0];
    } else if (
      this.#board[0][0] !== '' &&
      this.#board[0][0] === this.#board[1][0] &&
      this.#board[0][0] === this.#board[2][0]
    ) {
      this.#gameWinner = this.#board[0][0];
    } else if (
      this.#board[0][1] !== '' &&
      this.#board[0][1] === this.#board[1][1] &&
      this.#board[0][1] === this.#board[2][1]
    ) {
      this.#gameWinner = this.#board[0][1];
    } else if (
      this.#board[0][2] !== '' &&
      this.#board[0][2] === this.#board[1][2] &&
      this.#board[0][2] === this.#board[2][2]
    ) {
      this.#gameWinner = this.#board[0][2];
    } else if (
      this.#board[0][0] !== '' &&
      this.#board[0][0] === this.#board[1][1] &&
      this.#board[0][0] === this.#board[2][2]
    ) {
      this.#gameWinner = this.#board[0][0];
    } else if (
      this.#board[0][2] !== '' &&
      this.#board[0][2] === this.#board[1][1] &&
      this.#board[0][2] === this.#board[2][0]
    ) {
      this.#gameWinner = this.#board[0][2];
    }

    if (this.#gameWinner !== undefined) {
      this.#isGameOver = true;
      return;
    }

    const isBoardFilled = this.#board.every((row) => row.every((cell) => cell !== ''));
    if (isBoardFilled) {
      this.#isGameOver = true;
      this.#gameWinner = 'DRAW';
    }
  }

  #initializeBoard(): void {
    this.#board = [];
    for (let i = 0; i < 3; i += 1) {
      this.#board.push([]);
      for (let j = 0; j < 3; j += 1) {
        this.#board[i].push('');
      }
    }
    this.#currentPlayerTurn = Player.X;
    this.#gameWinner = undefined;
    this.#isGameOver = false;
  }
}
