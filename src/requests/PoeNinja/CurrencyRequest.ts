import { Request } from "../Request";
import { JsonValidator } from "../../validators/JsonValidator";
import * as Ajv from "ajv";
import { Currency, PoeNinjaInterface, RequestInterface } from "../../types";

export class CurrencyRequest extends Request {
  private url: string =
    "http://poe.ninja/api/Data/GetCurrencyOverview?league=Abyss";
  private errorMessage: string = "Data returned via poe.ninja api is not valid";

  public async fetchList(): Promise<Currency.ChaosEquivalent[]> {
    let response: RequestInterface.Response;
    try {
      response = await this.fetchData(this.url);
    } catch (err) {
      throw new Error(`api hasn't respond to request`);
    }
    if (!JsonValidator.validate(response.body)) {
      throw new Error(this.errorMessage);
    }
    const responseData = JSON.parse(response.body);
    if (this.validateResponse(responseData)) {
      return this.parseResponse(responseData);
    }
    throw new Error(
      "unexpected errors occurred with poeNinja currency validating"
    );
  }

  private validateResponse(apiData: object): apiData is PoeNinjaInterface.Api {
    const payReceiveSchema = {
      oneof: [
        { type: null },
        {
          type: "object",
          properties: {
            count: {
              type: "number"
            },
            dataPointCount: {
              type: "number"
            },
            getCurrencyId: {
              type: "number"
            },
            id: {
              type: "number"
            },
            includes_secondary: {
              type: "boolean"
            },
            leagueId: {
              type: "number"
            },
            payCurrencyId: {
              type: "number"
            },
            sampleTimeUtc: {
              type: "string"
            },
            value: {
              type: "number"
            }
          }
        }
      ]
    };
    const mainSchema = {
      type: "object",
      properties: {
        currencyDetails: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: {
                type: "number"
              },
              icon: {
                type: "string"
              },
              name: {
                type: "string"
              },
              poeTradeId: {
                type: "number"
              }
            }
          }
        },
        lines: {
          type: "array",
          items: {
            type: "object",
            properties: {
              chaosEquivalent: {
                type: "number"
              },
              currencyTypeName: {
                type: "string"
              },
              pay: payReceiveSchema,
              receive: payReceiveSchema,
              // pay and receive spark lines are used for internal site graphics - they're irrelevant here
              paySparkLine: {
                type: "object"
              },
              receiveSparkLine: {
                type: "object"
              }
            }
          }
        }
      }
    };
    const validator = new Ajv();
    if (validator.validate(mainSchema, apiData)) {
      return true;
    }
    return false;
  }

  private parseResponse(
    data: PoeNinjaInterface.Api
  ): Currency.ChaosEquivalent[] {
    const values = data.lines;
    return values.map(value => {
      let chaosEquivalent;
      if (value.receive && value.pay) {
        chaosEquivalent = (value.receive.value + 1 / value.pay.value) / 2;
      }
      return {
        name: value.currencyTypeName,
        value: chaosEquivalent
      };
    });
  }
}
