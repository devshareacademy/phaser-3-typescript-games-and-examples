import { TUTORIAL_IMAGE_ASSET_KEYS } from '../assets/asset-keys';
import { Button } from '../objects/button';
import { Dialog } from '../objects/dialog';
import { InfoPanel } from '../objects/info-panel';
import { NPC } from '../objects/npc';
import { Speaker } from '../objects/speaker';
import { sleep } from '../utils/sleep';

type LevelData = {
  scene: Phaser.Scene;
  currentLevel: number;
  speakers: Speaker[];
  buttons: Button[];
  npcs: NPC[];
  npcDialogModal: Dialog;
  mainDialogModal: Dialog;
  infoPanel: InfoPanel;
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
    speaker.inTutorial = true;
    speaker.sprite.disableInteractive();
  });
  config.buttons.forEach((button) => {
    button.inTutorial = true;
    button.sprite.disableInteractive();
  });
  config.npcs.forEach((npc) => {
    npc.inTutorial = true;
    npc.sprite.disableInteractive();
  });

  await setupLevel1Tutorial(config);

  // enable all element for the level
  config.speakers.forEach((speaker) => {
    speaker.inTutorial = false;
    speaker.sprite.setInteractive();
  });
  config.buttons.forEach((button) => {
    button.inTutorial = false;
    button.sprite.setInteractive();
  });
  config.npcs.forEach((npc) => {
    npc.inTutorial = false;
    npc.sprite.setInteractive();
  });
}

export async function setupLevel1Tutorial(config: LevelData): Promise<void> {
  // highlight speaker by first npc
  const speaker = config.speakers[0].sprite;
  speaker.setAlpha(1);
  await waitForInputOnObject(speaker);
  // config.speakers[0].inTutorial = false;
  // config.speakers[0].handlePlayerClick();
  // config.speakers[0].inTutorial = true;

  // // show in game tutorial message
  // config.infoPanel.updateContent([
  //   config.scene.add.image(-80, 0, TUTORIAL_IMAGE_ASSET_KEYS.TUTORIAL_SPEAKER, 0).setScale(0.75),
  //   config.scene.add.text(
  //     -30,
  //     -70,
  //     'After you click on a speaker, the speakers range will be shown for a small period of time. When a character is within range of the speaker, you will be able to communicate with them.',
  //     config.infoPanel.getInfoPanelTextStyle(),
  //   ),
  // ]);
  // config.infoPanel.show();
  // config.scene.scene.pause();
  // await sleep(1500);
  // config.scene.scene.resume();
  // await waitForInput(config.scene);
  // config.infoPanel.hide();

  // // start dialog between player and npc
  // config.mainDialogModal.setPosition(80, 40);
  // config.npcDialogModal.setPosition(40, 200);
  // await showMainMessage(config, '....Hey there! Can you hear me?');
  // await showNpcMessage(config, "Oh great... Now I'm hearing voices...");
  // await showMainMessage(config, 'Oh boy... a crazy one. Maybe I should help someone else first...');
  // await showNpcMessage(config, 'Figures... now my own voice is calling me crazy...');
  // await showMainMessage(config, "Okay. I'll be back later.");
  // await showNpcMessage(config, 'Wait... there is really someone there?');
  // await showMainMessage(config, "Yeah. I'm trying to help you all escape.");
  // await showNpcMessage(config, 'Really? I thought I would be here forever.');
  // await showMainMessage(config, 'We will have to work quickly before they realize I hacked their system.');
  // await showMainMessage(config, 'Is there anything you notice about your cell?');

  // have npc interact with door
  await config.npcs[0].moveToPosition(70);
  // await showNpcMessage(config, 'Hmmm... the door just seems to be malfunctioning.');
  // await showNpcMessage(config, 'It just keeps opening and closing.');
  // await showNpcMessage(config, "Almost like it doesn't have enough power...");
  // await showMainMessage(config, 'Do you think you can squeeze through the gap?');
  // await showNpcMessage(config, '. . . . . . .');
  // await showMainMessage(config, "OKAY, I can see you don't like that idea...");
  // await showMainMessage(config, 'Let me see if there is anything I can do from my end.');

  // // highlight button with power to take
  // await waitForInputOnObject(config.buttons[0].sprite);
  // config.buttons[0].inTutorial = false;
  // config.buttons[0].handlePlayerClick();
  // config.buttons[0].inTutorial = true;
  // await showMainMessage(config, 'Hmmm... looks like that freed up some power that...');
  // await showMainMessage(config, 'I can redirect to the other door.');

  // // highlight energy bar and show new energy available
  // const panelText = config.scene.add.text(
  //   -140,
  //   -30,
  //   'To activate various devices in each level, you will need to provide power to those objects.\nHowever, in each level the total amount of power will be limited, and you will often not be able to power all devices at once.',
  //   { ...config.infoPanel.getInfoPanelTextStyle(), ...{ wordWrap: { width: 280 } } },
  // );
  // config.infoPanel.updateContent([
  //   config.scene.add.image(0, -60, TUTORIAL_IMAGE_ASSET_KEYS.TUTORIAL_ENERGY, 0).setScale(0.5),
  //   panelText,
  // ]);
  // config.infoPanel.show();
  // await waitForInput(config.scene);
  // panelText.setText(
  //   'The energy bars at the top of the screen represent how much energy is currently available for you to use.\n\nRight now, you have 3 out of 4 possible energy that is in this room.',
  // );
  // await waitForInput(config.scene);
  // config.infoPanel.hide();

  // // highlight door that needs to be opened and then show details about clicking on objects
  // await waitForInputOnObject(config.buttons[1].sprite);
  // config.buttons[1].inTutorial = false;
  // config.buttons[1].handlePlayerClick();
  // config.buttons[1].inTutorial = true;

  // config.infoPanel.updateContent([
  //   config.scene.add.image(0, -60, TUTORIAL_IMAGE_ASSET_KEYS.TUTORIAL_ENERGY, 0).setScale(0.5),
  //   config.scene.add.text(
  //     -140,
  //     -30,
  //     'By clicking on the various panels, you can add and remove power from the connected device.',
  //     { ...config.infoPanel.getInfoPanelTextStyle(), ...{ wordWrap: { width: 280 } } },
  //   ),
  // ]);
  // config.infoPanel.show();
  // await waitForInput(config.scene);
  // config.infoPanel.hide();

  // await showNpcMessage(config, 'Nice! Just a little more power and the door should be fully open!');
  // await waitForInputOnObject(config.buttons[1].sprite);
  // config.buttons[1].inTutorial = false;
  // config.buttons[1].handlePlayerClick();
  // config.buttons[1].inTutorial = true;
  // await showNpcMessage(config, "Woo hoo! I'm free!!!!!");

  // // highlight npc and tell player how to get them to move
  // await waitForInputOnObject(config.npcs[0].sprite);
  // config.npcs[0].inTutorial = false;
  // config.npcs[0].handlePlayerClick();
  // config.npcs[0].inTutorial = true;

  // config.infoPanel.updateContent([
  //   config.scene.add.image(-80, 0, TUTORIAL_IMAGE_ASSET_KEYS.TUTORIAL_SPEAKER, 0).setScale(0.75),
  //   config.scene.add.text(
  //     -30,
  //     -70,
  //     'When a character is within a speakers range, you are able to tell the npc what you want them to do.\n\nBy clicking on the npc, you can tell them to start or stop moving.',
  //     config.infoPanel.getInfoPanelTextStyle(),
  //   ),
  // ]);
  // config.infoPanel.show();
  // await waitForInput(config.scene);
  // config.infoPanel.hide();

  // main part of first tutorial is done, unlock objects so player can now play the level
}

/*
have map metadata that mentions if tutorial or not, if tutorial
main menu, start game

highlight npc, modal details about clicking on npc to make them move and stop
npc runs, have collider if other door is not open, have npc pause and say something about opening the other door

*/
