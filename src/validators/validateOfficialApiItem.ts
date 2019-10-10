import * as Ajv from "ajv";
import { OfficialApi } from "../types";
import {
  booleanType,
  stringType,
  stringArrayType,
  numberType
} from "./ajvHelpers";

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
          items: [stringType, numberType]
        }
      },
      displayMode: numberType,
      type: numberType,
      progress: numberType
    },
    required: ["name", "values", "displayMode"],
    additionalProperties: false
  }
};

const socketsSchema = {
  type: "array",
  items: {
    type: "object",
    properties: {
      group: { type: "number", minimum: 0, maximum: 5 },
      sColour: { type: "string", pattern: "^[GWRBA]|DV$" },
      attr: { type: "string", pattern: "^[SDIGA]|DV$" }
    },
    additionalProperties: false,
    required: ["group", "sColour", "attr"]
  }
};

const mainCategories = [
  "maps",
  "accessories",
  "armour",
  "jewels",
  "weapons",
  "gems",
  "flasks",
  "currency",
  "cards",
  "monsters"
].join("|");
const extendedProperties = {
  type: "object",
  properties: {
    category: { type: "string", pattern: `^(${mainCategories})$` },
    subcategories: stringArrayType,
    prefixes: numberType,
    suffixes: numberType
  },
  additionalProperties: false,
  required: ["category"]
};

const hybridProperties = {
  type: "object",
  properties: {
    isVaalGem: booleanType,
    baseTypeName: stringType,
    explicitMods: stringArrayType,
    properties: itemPropertiesSchema,
    secDescrText: stringType
  },
  additionalProperties: false,
  required: ["baseTypeName", "explicitMods", "properties", "secDescrText"]
};

const incubatedItemProprties = {
  type: "object",
  properties: {
    level: numberType,
    name: stringType,
    progress: numberType,
    total: numberType
  },
  additionalProperties: false,
  required: ["level", "name", "progress", "total"]
};

const itemSchema = {
  type: "object",
  properties: {
    abyssJewel: booleanType,
    additionalProperties: itemPropertiesSchema,
    artFilename: stringType,
    corrupted: booleanType,
    cosmeticMods: stringArrayType,
    craftedMods: stringArrayType,
    delve: booleanType,
    descrText: stringType,
    duplicated: booleanType,
    elder: booleanType,
    enchantMods: stringArrayType,
    explicitMods: stringArrayType,
    extended: extendedProperties,
    flavourText: stringArrayType,
    fractured: booleanType,
    fracturedMods: stringArrayType,
    frameType: { type: "number", minimum: 0, maximum: 9 },
    h: numberType,
    hybrid: hybridProperties,
    icon: stringType,
    id: stringType,
    identified: booleanType,
    ilvl: numberType,
    implicitMods: stringArrayType,
    incubatedItem: incubatedItemProprties,
    inventoryId: stringType,
    isRelic: booleanType,
    // league was false on some items. It may fail there
    league: stringType,
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
    socketedItems: { type: "array", items: { type: "object" } },
    sockets: socketsSchema,
    stackSize: numberType,
    support: booleanType,
    synthesised: booleanType,
    talismanTier: numberType,
    typeLine: stringType,
    utilityMods: stringArrayType,
    veiled: booleanType,
    veiledMods: stringArrayType,
    verified: booleanType,
    w: numberType,
    x: numberType,
    y: numberType
    // add this stuff to typescript and to wiki
  },
  // additionalProperties: false,
  required: [
    "frameType",
    "h",
    "icon",
    "id",
    "identified",
    "ilvl",
    "inventoryId",
    "league",
    "name",
    "verified",
    "w",
    "x",
    "y"
  ],
  additionalProperties: false,
  patternProperties: {
    "^[\\w\\W]*RaceReward$": booleanType
  }
};

const validateOfficialApiItem = (
  items: unknown
): items is OfficialApi.ItemFull[] => {
  const ajv = new Ajv();
  const schema = { type: "array", items: itemSchema };
  return !!ajv.validate(schema, items);
};

export default validateOfficialApiItem;
