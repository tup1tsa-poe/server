import * as _ from "lodash";
import { InternalApi } from "../types";

import Item = InternalApi.Item;

export class ItemParser {
  private items: Item[];

  constructor(items: Item[]) {
    this.items = items;
  }

  getAllUniqueData() {
    return {
      names: this.getAllUniqueNames(),
      typeLines: this.getAllUniqueTypeLines(),
      icons: this.getAllUniqueIcons(),
      descrText: this.getAllUniqueDescriptions(),
      modifiers: this.getAllUniqueModifiers()
    };
  }

  /**
   *
   * @returns {string[][]} array of unique modifiers names with modifier type as index of sub array
   */
  private getAllUniqueModifiers(): string[][] {
    const allModifiers = _.chain(this.items)
      .map(item => item.modifiers)
      .reduce((currentMods, totalMods) => {
        return totalMods.concat(currentMods);
      }, [])
      .value();
    const modifiersByType: string[][] = [];
    allModifiers.forEach(modifier => {
      const index = modifier.type;
      if (modifiersByType[index]) {
        modifiersByType[index].push(modifier.name);
      } else {
        modifiersByType[index] = [modifier.name];
      }
    });
    return modifiersByType.map(modifiersGroup => {
      return _.uniq(modifiersGroup);
    });
  }

  private getAllUniqueDescriptions() {
    return _.chain(this.items)
      .map(item => item.officialApiItem.descrText)
      .uniq()
      .value();
  }

  private getAllUniqueTypeLines() {
    return _.chain(this.items)
      .map(item => item.officialApiItem.typeLine)
      .uniq()
      .value();
  }

  private getAllUniqueNames() {
    return _.chain(this.items)
      .map(item => item.officialApiItem.name)
      .filter(name => name.length !== 0)
      .uniq()
      .value();
  }

  private getAllUniqueIcons() {
    return _.chain(this.items)
      .map(item => item.officialApiItem.icon)
      .uniq()
      .value();
  }
}
