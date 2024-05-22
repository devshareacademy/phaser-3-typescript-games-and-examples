function getRandomIntInclusive(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}

enum SimonError {
  INVALID_MOVE_GAME_IS_OVER = 'Game has already ended, please reset the game state.',
}

export default class Simon {
  #currentSequence: number[] = [];
  #playerMoves: number[] = [];
  #isGameOver = false;

  constructor() {
    this.#initializeGame();
  }

  get sequence(): number[] {
    return [...this.#currentSequence];
  }

  get isGameOver(): boolean {
    return this.#isGameOver;
  }

  get isPlayerSequenceComplete(): boolean {
    return this.#playerMoves.length === this.#currentSequence.length;
  }

  public resetGame(): void {
    this.#initializeGame();
  }

  public generateNextSequenceElement() {
    // validate that the game is not already done
    if (this.#isGameOver) {
      throw new Error(SimonError.INVALID_MOVE_GAME_IS_OVER);
    }

    this.#currentSequence.push(getRandomIntInclusive(0, 3));
    // reset tracked players moves
    this.#playerMoves = [];
  }

  public checkPlayerMove(x: number) {
    // validate that the game is not already done
    if (this.#isGameOver) {
      throw new Error(SimonError.INVALID_MOVE_GAME_IS_OVER);
    }

    // only allow moves to be added if we have not validated a player sequence
    if (this.#playerMoves.length === this.#currentSequence.length) return;

    // add new move to the player sequence
    this.#playerMoves.push(x);

    // update game state if this last move was valid or not
    this.#isGameOver =
      this.#playerMoves[this.#playerMoves.length - 1] !== this.#currentSequence[this.#playerMoves.length - 1];
  }

  #initializeGame() {
    this.#currentSequence = [];
    this.#playerMoves = [];
    this.generateNextSequenceElement();
  }
}
