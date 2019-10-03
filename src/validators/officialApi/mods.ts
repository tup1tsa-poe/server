import * as Ajv from "ajv";

export const validateMods = (mods: object): boolean => {
  const schema = {
    type: "array",
    items: {
      type: "string"
    }
  };
  const validator = new Ajv();
  return !!validator.validate(schema, mods);
};
