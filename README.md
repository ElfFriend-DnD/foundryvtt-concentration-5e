# Concentration Reminders D&D5e

![Foundry Core Compatible Version](https://img.shields.io/badge/dynamic/json.svg?url=https%3A%2F%2Fraw.githubusercontent.com%2FElfFriend-DnD%2Ffoundryvtt-concentration-5e%2Fmain%2Fmodule.json&label=Foundry%20Version&query=$.compatibleCoreVersion&colorB=orange)
![Latest Release Download Count](https://img.shields.io/badge/dynamic/json?label=Downloads@latest&query=assets%5B1%5D.download_count&url=https%3A%2F%2Fapi.github.com%2Frepos%2FElfFriend-DnD%2Ffoundryvtt-concentration-5e%2Freleases%2Flatest)
![Forge Installs](https://img.shields.io/badge/dynamic/json?label=Forge%20Installs&query=package.installs&suffix=%25&url=https%3A%2F%2Fforge-vtt.com%2Fapi%2Fbazaar%2Fpackage%2Fconcentration-5e&colorB=4aa94a)
[![Foundry Hub Endorsements](https://img.shields.io/endpoint?logoColor=white&url=https%3A%2F%2Fwww.foundryvtt-hub.com%2Fwp-json%2Fhubapi%2Fv1%2Fpackage%2Fconcentration-5e%2Fshield%2Fendorsements)](https://www.foundryvtt-hub.com/package/concentration-5e/)
[![Foundry Hub Comments](https://img.shields.io/endpoint?logoColor=white&url=https%3A%2F%2Fwww.foundryvtt-hub.com%2Fwp-json%2Fhubapi%2Fv1%2Fpackage%2Fconcentration-5e%2Fshield%2Fcomments)](https://www.foundryvtt-hub.com/package/concentration-5e/)

[![ko-fi](https://img.shields.io/badge/-buy%20me%20a%20coke-%23FF5E5B)](https://ko-fi.com/elffriend)
[![patreon](https://img.shields.io/badge/-patreon-%23FF424D)](https://www.patreon.com/ElfFriend_DnD)

This module is a standalone, low-automation module which handles Concentration tracking reminders for 5e.

## Features

### Automatic Concentration Status Application
When a spell is cast which has the "Concentration" tag, a "Concentration" status effect is automatically applied to the casting actor.

We also make note which spell they are concentrating on in the title of this effect.

### Duplicate Concentration Reminders
When an actor with this "Concentrating" status casts a spell which has the "Concentration" component, the Spell Usage dialog will contain a warning that they are currently concentrating on something else (including what they are concentrating on).

No reminder is shown if they are re-casting the same spell they are currently concentrating on.


### Damage Taken Check Chat Card
When an actor currently "Concentrating" takes damage, prompt them for a concentration check with a chat card similar to any other effect which would prompt them for a saving throw.

The saving throw DC for this check is automatically calculated and displayed on the card.

"Takes Damage" is reliant on the following ways an Actor might take damage:
- Right Click -> Apply Damage from a 5e damage roll chat card.
- Right Click on a Token -> Manipulate the Health there.
- Any other module or macro which executes the `Actor5e#applyDamage()` method.
- **Manually editing the actor's HP from the actor sheet will not trigger this.**

There is some noise in the footer of these chat cards which is a known issue.

### Low Automation
This module has an intentionally limited scope aimed at helping GMs run the game, but it will not do the following things:

- prevent you from casting a concentration spell while concentrating
- automatically remove concentration effects in any situation
- clean up any other effects from a spell if the concentration effect for that spell is removed

## Compatibility

Requires More Hooks 5e

Supercharged by:
- [Temporary Effects as Token Statuses](https://github.com/ElfFriend-DnD/foundryvtt-temp-effects-as-statuses)

Compatible with:
- Core dnd5e roller
- Minimal Rolling Enhancements

Mostly Compatible with:
- Better Rolls 5e
- Midi QOL

I'm not actively supporting these two so if something breaks, I'm open to a PR but not invested.

If you're using Midi, it has automation configurations for concentration tracking already which make this module unnecessary.

## Attributions

<a href="https://www.flaticon.com/free-icons/remember" title="remember icons">Concentration icon created by Freepik - Flaticon</a>
