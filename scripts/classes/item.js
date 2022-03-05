import { Concentration5e } from '../concentration-5e.js'

/**
 * Handles all the logic related to Item usage and the display of its effects
 */
export class Concentration5eItem {
  constructor(item, actor) {
    this.item = item;
    this.actor = actor;
  }

  /**
   * Register Hooks
   */
  static init() {
    Hooks.on('Item5e.roll', Concentration5eItem.handleItemRoll);
  }

  /**
   * When an item is rolled create a card for the GM to easily apply Targeted Effects
   * @param {*} item 
   * @returns 
   */
  static handleItemRoll = async (item) => {
    if (!item.effects.size) {
      return;
    }
    const actor = item.parent;

    if (!(actor instanceof Actor)) {
      return;
    }

    const easyEffectsItem = new Concentration5eItem(item, actor);

    easyEffectsItem.createListChatCard()
  }

  /**
   * When an item is rolled which has temporary effects, create a chat card
   * for the GM only which allows them to see all effects from that item
   * as well as all the tokens the caster targeted (if any).
   * 
   * @see Concentration5eChat - for where the chat event listeners are registered
   */
  async createListChatCard() {
    const temporaryEffects = this.item.effects.filter(effect => effect.isTemporary);

    if (!temporaryEffects.length) {
      return;
    }

    const targetedTokens = [...(game.user.targets?.values() ?? [])].filter(t => !!t.actor);

    const html = await renderTemplate(
      `modules/${Concentration5e.MODULE_NAME}/templates/concentration-card.hbs`,
      {
        targetedTokens,
        effects: this.item.effects,
        isGM: game.user.isGM
      });

    Concentration5e.log('Creating Card:', {
      effects: this.item.effects,
      targetedTokens,
      html
    });

    const messageData = {
      whisper: ChatMessage.getWhisperRecipients('gm'),
      blind: true,
      user: game.user.data._id,
      flags: {
        core: {
          canPopout: true
        },
        [Concentration5e.MODULE_NAME]: {
          isEffectListCard: true,
          sourceActor: {
            actorId: this.actor.id,
            sceneId: canvas.scene?.id,
            tokenId: this.actor.isToken ? this.actor.token.id : null,
          },
          targetedTokenIds: targetedTokens.map(token => token.id),
          effectUuids: this.item.effects.map(effect => effect.uuid),
        }
      },
      type: CONST.CHAT_MESSAGE_TYPES.OTHER,
      speaker: { alias: game.i18n.localize(`${Concentration5e.MODULE_NAME}.MESSAGE_HEADER`) },
      content: html,
    }

    ChatMessage.create(messageData);
  };

}
