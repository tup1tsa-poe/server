import * as Ajv from "ajv";
import { Database } from "./Database";
import { Currency } from "../types";

export class CurrencyDatabase extends Database {
  constructor() {
    super("currency");
  }

  public async fetchLatestListFromDb(): Promise<Currency.DatabaseList> {
    await this.read({}, { updateTime: -1 }, 1);
    const result = this.getResult();
    if (!result.data) {
      throw new Error(
        "Error while fetching currency list from db. Check it existence"
      );
    }
    const list = result.data[0];
    if (!this.validateList(list)) {
      throw new Error("Currency list is fetched but it's invalid");
    }
    return list;
  }

  public async saveListToDb(list: Currency.DatabaseList): Promise<void> {
    if (!this.validateList(list)) {
      throw new Error("Currency list for saving is invalid");
    }
    await this.insert([list]);
    const result = this.getResult();
    if (result.error) {
      throw new Error(
        "There were some problems while saving currency list to db"
      );
    }
  }

  private validateList(list: object): list is Currency.DatabaseList {
    // todo: remove validation from db class
    const schema = {
      type: "object",
      properties: {
        updateTime: {
          type: "number"
        },
        exchangeRates: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: {
                type: "string"
              },
              chaosEquivalent: {
                oneof: [{ type: "number" }, { type: "null" }]
              }
            }
          }
        },
        _id: {
          type: "object"
        }
      }
    };
    const validator = new Ajv();
    if (validator.validate(schema, list)) {
      return true;
    }
    return false;
  }
}
