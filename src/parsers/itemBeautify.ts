import * as _ from "lodash";
import { OfficialApi, InternalApi } from "../types";

import { ModifiersConverter } from "../converters/ModifiersConverter";

function removeWeirdSymbolsFromName(name: string): string {
  const regExp = /<<[^>]*>>/g;
  return name.replace(regExp, "");
}

function cutIconUrl(url: string): string {
  const regExp = /\?[\s\S]*/g;
  return url.replace(regExp, "");
}

export const itemBeautify = function(
  rawItems: OfficialApi.Item[]
): InternalApi.Item[] {
  return rawItems.map(item => {
    const itemCopy: OfficialApi.Item = _.cloneDeep(item);
    itemCopy.name = removeWeirdSymbolsFromName(itemCopy.name);
    itemCopy.icon = cutIconUrl(itemCopy.icon);
    const parser = new ModifiersConverter(itemCopy);
    return {
      officialApiItem: itemCopy,
      modifiers: parser.getModifiers()
    };
  });
};
