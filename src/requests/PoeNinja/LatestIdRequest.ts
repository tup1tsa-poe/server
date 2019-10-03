// requests to http://poe.ninja/stats

import { Request } from "../Request";
import { JsonValidator } from "../../validators/JsonValidator";

export class LatestIdRequest extends Request {
  private officialApiId: string;
  private poeApiUrl: string = "http://api.poe.ninja/api/Data/GetStats";
  private wrongResponseError: string =
    "Poe ninja api id body should be valid json string";

  public async getLatestApiId(): Promise<string> {
    // latest key for official api
    const response = await this.fetchData(this.poeApiUrl);
    if (!response.success) {
      // throw an error temporary
      throw new Error("poe ninja api request finished with error");
    }
    this.officialApiId = this.getIdFromResponse(response.body);
    return this.officialApiId;
  }

  private getIdFromResponse(body: string): string {
    if (!JsonValidator.validate(body)) {
      throw new Error(this.wrongResponseError);
    }
    const parsedBody = JSON.parse(body);
    if (
      typeof parsedBody !== "object" ||
      typeof parsedBody.next_change_id !== "string"
    ) {
      throw new Error(this.wrongResponseError);
    }
    return parsedBody.next_change_id;
  }
}
