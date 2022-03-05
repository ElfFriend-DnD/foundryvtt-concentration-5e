// import { Concentration5eCanvas } from "./classes/canvas.js";
// import { Concentration5eChat } from "./classes/chat.js";
// import { Concentration5eItem } from "./classes/item.js";

export class Concentration5e {
  static MODULE_NAME = "concentration-5e";
  static MODULE_TITLE = "Concentration Reminders DnD5e";

  static log(...args) {
    if (game.modules.get('_dev-mode')?.api?.getPackageDebugValue(this.MODULE_NAME)) {
      console.log(this.MODULE_TITLE, '|', ...args);
    }
  }
}

Hooks.on("ready", async () => {
  console.log(`${Concentration5e.MODULE_NAME} | Initializing ${Concentration5e.MODULE_TITLE}`);

  // // initialize item hooks
  // Concentration5eItem.init();
});

Hooks.once('devModeReady', ({ registerPackageDebugFlag }) => {
  registerPackageDebugFlag(Concentration5e.MODULE_NAME);
});

// // initialize chat hooks
// Concentration5eChat.init();

// // initialize canvas hooks
// Concentration5eCanvas.init();

Hooks.on('Item5e.roll', (item, _roll, _options, actor) => {
  if (!item.type === 'spell' || !item.data.data.components?.concentration) {
    return;
  }

  const itemEffectDuration = getDurationFromItem(item);

  const fakeConcentrationEffectData = {
    changes: [],
    disabled: false,
    duration: itemEffectDuration,
    icon: `modules/${Concentration5e.MODULE_NAME}/images/concentrating.svg`,
    label: `${game.i18n.localize('DND5E.Concentration')} - ${item.name}`,
    origin: item.uuid,
    flags: {
      core: {
        statusId: 'concentrating',
      }
    }
  };

  actor.createEmbeddedDocuments('ActiveEffect', [fakeConcentrationEffectData]);
});

Hooks.on('renderAbilityUseDialog', (app, [html]) => {
  Concentration5e.log("rendering");

  // if the item isn't a spell or isn't a concentration spell
  if (app.item.type !== 'spell' || !app.item.data.data.components?.concentration) {
  Concentration5e.log("not a spell or not concentration", {
    spell: app.item.type !== 'spell',
    concnetration: app.item.data.data.components?.concentration,
  })
  return;
  }

  // if there's no parent or the parent has no effects
  if (!app.item.parent?.effects.size) {
  Concentration5e.log("actor has no effects")
  return;
  }

  const concentrationEffects = app.item.parent.effects.filter((effect) => 
    effect.data.flags?.core?.statusId === 'concentrating'
  );

  if (!concentrationEffects.length) {
  Concentration5e.log("not concentrating")
  return;
  }

  const concentratingOn = concentrationEffects.map((effect)=> effect.sourceName).filterJoin(', ');

  const node = document.createRange()
  .createContextualFragment(`
  <p class="notification warning">
    ${game.i18n.format('concentration-5e.CONCENTRATION_WARNING', {spell: app.item.name})}
    <br>
    <small>${game.i18n.format('concentration-5e.CURRENTLY_CONCENTRATING', {concentratingOn})}</small>
  </p>
  `);


  const notificationNode = html.querySelector('.notification');
  const formNode = html.querySelector('form');

  formNode.insertBefore(node, notificationNode);
  app.setPosition({height: 'auto'});
});


  /**
   * Gets default duration values from the provided item.
   * Assumes dnd5e data model, falls back to 1 round default.
   */
   function getDurationFromItem(item, passive) {

    if (passive === true) {
      return undefined;
    }

    if (!!item?.data.data.duration?.value) {

      let duration = {};

      switch (item.data.data.duration.units) {
        case 'hour':
          duration.seconds = item.data.data.duration?.value * 60 * 60;
          break;
        case 'minute':
          duration.seconds = item.data.data.duration?.value * 60;
          break;
        case 'day':
          duration.seconds = item.data.data.duration?.value * 60 * 60 * 24;
          break;
        case 'month':
          duration.seconds = item.data.data.duration?.value * 60 * 60 * 24 * 28;
          break;
        case 'year':
          duration.seconds = item.data.data.duration?.value * 60 * 60 * 24 * 365;
          break;
        case 'turn':
          duration.turns = item.data.data.duration?.value;
          break;
        case 'round':
          duration.rounds = item.data.data.duration?.value;
          break;
        default:
          duration.rounds = 1;
          break;
      }

      return duration
    }

    return {
      rounds: 1
    }
  }