import Ajv from "ajv";
import { OfficialApi } from "../types";
import {
  booleanType,
  stringType,
  stringArrayType,
  numberType
} from "./ajvHelpers";

const categorySchema = {
  oneOf: [
    {
      type: "object",
      properties: [],
      additionalProperties: false
    }
  ]
};

const socketsSchema = { type: "object" };

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

const validateOfficialApiItem = (
  item: unknown
): item is OfficialApi.ItemFull => {
  const ajv = new Ajv();
  return !!ajv.validate(itemSchema, item);
};

export default validateOfficialApiItem;
