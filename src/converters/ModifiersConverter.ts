import { OfficialApi, Modifiers } from "../types";

import Item = OfficialApi.Item;
import ModifierType = Modifiers.ModifierType;
import Modifier = Modifiers.Modifier;

export class ModifiersConverter {
  private item: Item;

  private modifiers: Modifiers.Modifier[] = [];

  constructor(item: Item) {
    this.item = item;
    this.convertModifiers();
  }

  getModifiers(): Modifier[] {
    return this.modifiers;
  }

  private convertModifiers(): void {
    let mods: Modifier[] = [];
    if (this.item.explicitMods) {
      mods = this.parseMultipleModifiers(
        this.item.explicitMods,
        ModifierType.explicitMods
      );
    }
    if (this.item.implicitMods) {
      mods = mods.concat(
        this.parseMultipleModifiers(
          this.item.implicitMods,
          ModifierType.implicitMods
        )
      );
    }
    if (this.item.craftedMods) {
      mods = mods.concat(
        this.parseMultipleModifiers(
          this.item.craftedMods,
          ModifierType.craftedMods
        )
      );
    }
    if (this.item.utilityMods) {
      mods = mods.concat(
        this.parseMultipleModifiers(
          this.item.utilityMods,
          ModifierType.utilityMods
        )
      );
    }
    if (this.item.enchantMods) {
      mods = mods.concat(
        this.parseMultipleModifiers(
          this.item.enchantMods,
          ModifierType.enchantMods
        )
      );
    }
    if (this.item.cosmeticMods) {
      mods = mods.concat(
        this.parseMultipleModifiers(
          this.item.cosmeticMods,
          ModifierType.cosmeticMods
        )
      );
    }
    this.modifiers = mods;
  }

  private parseMultipleModifiers(
    modifierTexts: string[],
    modifierType: number
  ): Modifier[] {
    return modifierTexts.map(modifierText =>
      this.parseModifier(modifierText, modifierType)
    );
  }

  private parseModifier(modifierText: string, modifierType: number): Modifier {
    const regExp = /(?:\d*\.)?\d+/g;
    return {
      type: modifierType,
      name: modifierText.replace(regExp, "#"),
      value: this.getValuesFromModifierText(modifierText)
    };
  }

  private getValuesFromModifierText(modifier: string): Modifiers.ModifierValue {
    // todo: With # or more Strength, #% of Damage dealt by your Zombies is Leeched to you as Life
    // redo those weird mods (one number is const, at least it should be)
    // it shouldn't be average
    const regExp = /(?:\d*\.)?\d+/g;
    const value: Modifiers.ModifierValue = {
      values: null,
      average: null
    };
    const searchResult = modifier.match(regExp);
    if (searchResult === null) {
      return value;
    }
    if (searchResult.length >= 1) {
      value.values = searchResult.map(result => parseFloat(result));
      const sum: number = value.values.reduce((current, total) => {
        return current + total;
      });
      value.average = sum / value.values.length;
    }
    return value;
  }
}
