import { OfficialApi } from "../../types";
import Socket = OfficialApi.Socket;
import * as Ajv from "ajv";

export const validateSockets = (sockets: object): sockets is Socket[] => {
  const schema = {
    type: "array",
    items: {
      type: "object",
      properties: {
        group: {
          type: "integer",
          maximum: 5,
          minimum: 0
        },
        attr: {
          oneOf: [
            { type: "boolean" },
            {
              type: "string",
              pattern: "^[SDIG]$"
            }
          ]
        },
        sColour: {
          type: "string",
          pattern: "^[GWRBA]$"
        }
      },
      additionalProperties: false,
      minProperties: 3
    }
  };
  const validator = new Ajv();
  return !!validator.validate(schema, sockets);
};
