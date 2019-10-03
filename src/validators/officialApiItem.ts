import { OfficialApi } from "../types";

export const validateOfficialApiItem = (
  item: object
): item is OfficialApi.Item => {
  return true;
};
