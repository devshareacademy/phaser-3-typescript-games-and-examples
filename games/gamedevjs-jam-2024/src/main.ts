import Game from './game/game';

window.onload = async () => {
  try {
    new Game().start();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    await window.screen.orientation['lock']('landscape');
  } catch (error) {
    console.log((error as Error).message);
  }
};
