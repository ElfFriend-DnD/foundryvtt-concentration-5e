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

### Concentration Status
Provides a status effect for "Concentrating" which makes it easy to tell that an actor is concentrating on a spell.

When a spell is cast which has the "Concentration" component, apply this temporary "Concentrating" status effect to the casting actor.
If possible, we also make note which spell they are concentrating on.

### Duplicate Concentration Reminders
When an actor currently "Concentrating" casts a spell which has the "Concentration" component, remind them that they are currently concentrating on something else.
Do not remind them if they are concentrating on the spell that was re-cast.

### Damage Taken Check
When an actor currently "Concentrating" takes damage, prompt them for a concentration check.

"Takes Damage" is reliant on the following ways an Actor might take damage:
- Right Click -> Apply Damage from a 5e damage roll chat card.
- Right Click on a Token -> Manipulate the Health there.
- Any other module or macro which executes the `Actor5e#applyDamage()` method.
- **Manually editing the actor's HP from the actor sheet will not trigger this.**


## Compatibility

Requires More Hooks 5e

Compatible with:
- Core dnd5e roller
- Minimal Rolling Enhancements

Mostly Compatible with:
- Better Rolls 5e
- Midi QOL

I'm not actively supporting these two so if something breaks, I'm open to a PR but not invested.

If you're using Midi, it has automation configurations for concentration tracking already.

## Attributions

<a href="https://www.flaticon.com/free-icons/remember" title="remember icons">Concentration icon created by Freepik - Flaticon</a>