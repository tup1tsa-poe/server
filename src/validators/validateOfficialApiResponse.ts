import * as Ajv from "ajv";
import { OfficialApi } from "../types";
import { stringType, booleanType, nullType } from "./ajvHelpers";

import GeneralResponse = OfficialApi.GeneralResponse;

const validateOfficialApiResponse = (
  response: unknown
): response is GeneralResponse => {
  const itemSchema = {
    type: "object",
    properties: {
      id: stringType,
      inventoryId: stringType,
      league: stringType
    }
  };

  const stashSchema = {
    type: "object",
    properties: {
      id: stringType,
      items: { type: "array", items: itemSchema },
      public: booleanType,
      lastCharacterName: { oneOf: [stringType, nullType] },
      stash: { oneOf: [stringType, nullType] },
      stashType: stringType,
      accountName: { oneOf: [stringType, nullType] },
      league: { oneOf: [stringType, nullType] }
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
  if (valid) {
    return true;
  }
  return false;
};

export default validateOfficialApiResponse;
