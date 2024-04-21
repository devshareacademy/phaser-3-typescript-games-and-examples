export function playBackgroundMusic(scene: Phaser.Scene, audioKey: string): void {
  // get all of the audio objects that are currently playing so we can check if the sound we
  // want to play is already playing, and to stop all other sounds
  const existingSounds = scene.sound.getAllPlaying();
  let musicAlreadyPlaying = false;

  existingSounds.forEach((sound) => {
    if (sound.key === audioKey) {
      musicAlreadyPlaying = true;
      return;
    }
    sound.stop();
  });

  if (!musicAlreadyPlaying) {
    scene.sound.play(audioKey, {
      loop: true,
    });
  }
}

export function playSoundFx(scene: Phaser.Scene, audioKey: string): void {
  scene.sound.play(audioKey, {
    volume: 0.5,
  });
}
