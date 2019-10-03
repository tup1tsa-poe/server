import * as Ajv from "ajv";
import * as _ from "lodash";
import { OfficialApi } from "../types";
import { categories } from "../categories";

import GeneralResponse = OfficialApi.GeneralResponse;

export class OfficialApiResponseValidator {
  public static validate(response: object): response is GeneralResponse {
    const booleanType = { type: "boolean" };
    const stringType = { type: "string" };
    const numberType = { type: "number" };
    const nullType = { type: "null" };

    const itemPropertiesSchema = {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: stringType,
          values: {
            type: "array",
            items: {
              type: "array",
              items: [{ oneOf: [stringType, numberType] }, numberType]
            }
          },
          displayMode: numberType,
          type: numberType,
          progress: numberType
        },
        additionalProperties: false
      }
    };

    const stringPattern = (names: string[]): object => {
      const pattern: string = names
        .map(name => {
          return `${name}`;
        })
        .join("|");
      return {
        type: "string",
        pattern: `(${pattern})`
      };
    };

    const categoryArray = (names?: string[]): object => {
      if (!names) {
        return {
          type: "array"
        };
      }
      return {
        type: "array",
        items: [stringPattern(names)]
      };
    };

    const categoryProperties = _.mapValues(categories, subcategories => {
      return categoryArray(subcategories);
    });

    const categorySchema = {
      oneOf: [
        {
          type: "object",
          properties: categoryProperties,
          additionalProperties: false
        }
      ]
    };

    const itemSchema = {
      type: "object",
      properties: {
        abyssJewel: booleanType,
        additionalProperties: itemPropertiesSchema,
        artFilename: stringType,
        category: categorySchema,
        corrupted: booleanType,
        cosmeticMods: stringArrayType,
        craftedMods: stringArrayType,
        descrText: stringType,
        duplicated: booleanType,
        elder: booleanType,
        enchantMods: stringArrayType,
        explicitMods: stringArrayType,
        flavourText: stringArrayType,
        frameType: numberType,
        h: numberType,
        icon: stringType,
        id: stringType,
        identified: booleanType,
        ilvl: numberType,
        implicitMods: stringArrayType,
        inventoryId: stringType,
        isRelic: booleanType,
        /**
         * it can be false for some reason
         */
        league: {
          oneOf: [stringType, booleanType]
        },
        lockedToCharacter: booleanType,
        maxStackSize: numberType,
        name: stringType,
        nextLevelRequirements: itemPropertiesSchema,
        note: stringType,
        properties: itemPropertiesSchema,
        prophecyDiffText: stringType,
        prophecyText: stringType,
        requirements: itemPropertiesSchema,
        secDescrText: stringType,
        shaper: booleanType,
        socketedItems: { type: "array" },
        sockets: socketsSchema,
        stackSize: numberType,
        support: booleanType,
        talismanTier: numberType,
        typeLine: stringType,
        utilityMods: stringArrayType,
        verified: booleanType,
        w: numberType,
        x: numberType,
        y: numberType,
        thRaceReward: booleanType,
        cisRaceReward: booleanType,
        seaRaceReward: booleanType
        // add this stuff to typescript and to wiki
      },
      additionalProperties: false,
      patternProperties: {
        "^[\\s]*RaceReward": booleanType
      }
    };

    const stashSchema = {
      type: "object",
      properties: {
        accountName: {
          oneOf: [stringType, nullType]
        },
        id: stringType,
        items: {
          type: "array",
          items: itemSchema
        },
        lastCharacterName: {
          oneOf: [stringType, nullType]
        },
        public: booleanType,
        stash: {
          oneOf: [stringType, nullType]
        },
        stashType: stringType
      },
      additionalProperties: false
    };

    const responseSchema = {
      type: "object",
      properties: {
        next_change_id: stringType,
        stashes: {
          type: "array",
          items: stashSchema
        }
      },
      additionalProperties: false
    };

    const ajv = new Ajv();
    const valid = ajv.validate(responseSchema, response);
    // const errors = ajv.errors;
    if (valid) {
      return true;
    }
    return false;
  }
}
