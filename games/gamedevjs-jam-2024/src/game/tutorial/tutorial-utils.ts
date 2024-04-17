import { Button } from '../objects/button';
import { Dialog } from '../objects/dialog';
import { NPC } from '../objects/npc';
import { Speaker } from '../objects/speaker';

type LevelData = {
  scene: Phaser.Scene;
  currentLevel: number;
  speakers: Speaker[];
  buttons: Button[];
  npcs: NPC[];
  npcDialogModal: Dialog;
  mainDialogModal: Dialog;
};

export async function waitForInput(scene: Phaser.Scene): Promise<void> {
  return new Promise((resolve) => {
    if (scene.input.keyboard === null) {
      return resolve();
    }
    scene.input.keyboard.once(Phaser.Input.Keyboard.Events.ANY_KEY_DOWN, () => {
      resolve();
    });
  });
}

export async function showNpcMessage(config: LevelData, text: string): Promise<void> {
  await config.npcDialogModal.showDialog(text);
  await waitForInput(config.scene);
  config.npcDialogModal.hide();
}

export async function showMainMessage(config: LevelData, text: string): Promise<void> {
  await config.mainDialogModal.showDialog(text);
  await waitForInput(config.scene);
  config.mainDialogModal.hide();
}

export async function waitForInputOnObject(obj: Phaser.GameObjects.Sprite): Promise<void> {
  let tween: Phaser.Tweens.Tween;
  if (obj.preFX) {
    obj.preFX.setPadding(10);
    const fx = obj.preFX.addGlow(0xff00ff, 0.2);
    tween = obj.scene.tweens.add({
      targets: fx,
      outerStrength: 3,
      yoyo: true,
      loop: -1,
      ease: Phaser.Math.Easing.Sine.InOut,
    });
  }

  obj.setInteractive();

  return new Promise((resolve) => {
    obj.once(Phaser.Input.Events.POINTER_DOWN, () => {
      obj.disableInteractive();
      if (tween) {
        tween.stop();
        obj.clearFX();
      }
      resolve();
    });
  });
}

export async function setupTutorial(config: LevelData): Promise<void> {
  if (config.currentLevel > 1) {
    return;
  }

  // disable all elements for the level
  config.speakers.forEach((speaker) => {
    speaker.sprite.disableInteractive();
  });
  config.buttons.forEach((button) => {
    button.sprite.disableInteractive();
  });
  config.npcs.forEach((npc) => {
    npc.sprite.disableInteractive();
  });

  await setupLevel1Tutorial(config);
}

export async function setupLevel1Tutorial(config: LevelData): Promise<void> {
  // highlight speaker by first npc
  config.speakers[0].inTutorial = true;
  const speaker = config.speakers[0].sprite;
  speaker.setAlpha(1);

  await waitForInputOnObject(speaker);
  config.mainDialogModal.setPosition(80, 40);
  config.npcDialogModal.setPosition(40, 200);

  await showMainMessage(config, '....Hey there! Can you hear me?');
  // await showNpcMessage(config, "Oh great... Now I'm hearing voices...");
  // await showMainMessage(config, 'Oh boy... a crazy one. Maybe I should help someone else first...');
  // await showNpcMessage(config, 'Figures... now my own voice is calling me crazy...');
  // await showMainMessage(config, "Okay. I'll be back later.");
  // await showNpcMessage(config, 'Wait... there is really someone there?');
  // await showMainMessage(config, "Yeah. I'm trying to help you all escape.");
  // await showNpcMessage(config, 'Really? I thought I would be here forever.');
  // await showMainMessage(config, 'We will have to work quick before they realize I hacked their system.');
  // await showMainMessage(config, 'Is there anything you notice about your cell?');

  //await config.npcs[0].moveToPosition(70);
  //await showNpcMessage(config, 'Hmmm... the door just seems to be malfunctioning.');
  // await showNpcMessage(config, 'It just keeps opening and closing.');
  // await showNpcMessage(config, "Almost like it doesn't have enough power...");
  // await showMainMessage(config, 'Do you think you can climb through the gap?');
  // await showNpcMessage(config, '. . . . . . .');
  // await showMainMessage(config, "OKAY, I can see you don't like that idea...");
  // await showMainMessage(config, 'Let me see if there is anything I can do from my end.');

  // highlight button with power to take
  config.buttons[0].inTutorial = true;
  await waitForInputOnObject(config.buttons[0].sprite);
  await showMainMessage(config, 'Hmmm... looks like that freed up some power that');
  await showMainMessage(config, 'I can redirect to the other door.');

  // highlight energy bar and show new energy available
}

/*
have map metadata that mentions if tutorial or not, if tutorial
main menu, start game

highlight other door, click, 1 energy add, highlight with text modal showing text about device shows how much eneergy is added to the device
npc speech bubble, nice, just a little more power and the door should be fully open!
highlight door, click, door is open
npc speech bubble nice!
highlight npc, modal details about clicking on npc to make them move and stop
npc runs, have collider if other door is not open, have npc pause and say something about opening the other door

*/
