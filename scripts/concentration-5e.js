export class Concentration5e {
  static MODULE_NAME = "concentration-5e";
  static MODULE_TITLE = "Concentration Reminders DnD5e";

  static log(...args) {
    if (game.modules.get('_dev-mode')?.api?.getPackageDebugValue(this.MODULE_NAME)) {
      console.log(this.MODULE_TITLE, '|', ...args);
    }
  }

  static getFakeConcentrationEffect(item) {
    const itemEffectDuration = getDurationFromItem(item);

    return {
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
  }
}

Hooks.on("ready", async () => {
  console.log(`${Concentration5e.MODULE_NAME} | Initializing ${Concentration5e.MODULE_TITLE}`);
});

Hooks.once('devModeReady', ({ registerPackageDebugFlag }) => {
  registerPackageDebugFlag(Concentration5e.MODULE_NAME);
});

Hooks.on('Item5e.roll', (item) => {
  if (!item.type === 'spell' || !item.data.data.components?.concentration || !item.parent) {
    return;
  }

  const concentrationEffects = item.parent.effects.filter((effect) =>
    !effect.isSuppressed && effect.data.flags?.core?.statusId === 'concentrating'
  );

  if (concentrationEffects.filter(
    (effect) => effect.data.origin === item.uuid
  ).length) {
    Concentration5e.log("recasting a spell")
    return;
  }

  const fakeConcentrationEffectData = Concentration5e.getFakeConcentrationEffect(item);

  item.parent.createEmbeddedDocuments('ActiveEffect', [fakeConcentrationEffectData]);
});

Hooks.on('renderAbilityUseDialog', (app, [html]) => {
  Concentration5e.log("rendering", {
    item: app.item,
    effects: app.item.parent.effects
  });

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
    !effect.isSuppressed && effect.data.flags?.core?.statusId === 'concentrating'
  );

  if (!concentrationEffects.length) {
    Concentration5e.log("not concentrating")
    return;
  }

  // stop if this new spell is already being concentrated on
  if (concentrationEffects.filter(
    (effect) => effect.data.origin === app.item.uuid
  ).length) {
    Concentration5e.log("recasting a spell")
    return;
  }

  const concentratingOn = concentrationEffects.map((effect) => effect.sourceName).filterJoin(', ');

  const element = `
  <p class="notification info">
    ${game.i18n.format('concentration-5e.CONCENTRATION_WARNING', { spell: app.item.name })}
    <br>
    <small>${game.i18n.format('concentration-5e.CURRENTLY_CONCENTRATING', { concentratingOn })}</small>
  </p>
  `

  html.querySelector('.notes')?.insertAdjacentHTML('afterend', element);
  app.setPosition({ height: 'auto' });
});


Hooks.on('Actor5e.applyDamage', async (actor, totalDamageTaken) => {
  debugger;
  // abort if user healed or took no damage
  if (Math.sign(totalDamageTaken) > -1) {
    return;
  }

  const concentrationEffects = actor.effects.filter(
    (effect) => !effect.isSuppressed && effect.data.flags?.core?.statusId === 'concentrating'
  );

  if (!concentrationEffects.length) {
    return;
  }

  const halfDamageTaken = Math.floor(Math.abs(totalDamageTaken) / 2);
  const saveDc = halfDamageTaken < 10 ? 10 : halfDamageTaken;

  concentrationEffects.forEach((effect) => {
    const fakeConcentrationItem = new Item.implementation({
      name: effect.data.label,
      img: `modules/${Concentration5e.MODULE_NAME}/images/concentrating.svg`,
      type: 'consumable',
      data: {
        description: {
          value: game.i18n.format(`${Concentration5e.MODULE_NAME}.CHECK_PROMPT`, {
            name: actor.name,
            spell: effect.sourceName,
            damage: Math.abs(totalDamageTaken)
          }),
        },
        actionType: 'save',
        save: {
          ability: 'con',
          dc: saveDc,
          scaling: 'flat',
        },
      }
    }, {temporary: true, parent: actor});

    // gets the chat button's save dc label
    fakeConcentrationItem.getSaveDC();

    // removes some noise from the chat footer
    delete fakeConcentrationItem.data.data.equipped;

    Concentration5e.log(fakeConcentrationItem)
    
    fakeConcentrationItem.displayCard({
      createMessage: true,
      rollMode: CONST.DICE_ROLL_MODES.PUBLIC
    });
  });
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
