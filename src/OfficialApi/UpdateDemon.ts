import StashApiRequest from "../requests/StashApiRequest";
import { RequestInterface } from "../types";
import LatestIdRequest from "../requests/PoeNinja/LatestIdRequest";

/* interface ApiDescription {
    time: string;
    changeId: string;
    exist: boolean;
} */

export class UpdateDemon {
  private currentId: string = "0000";

  private readonly officialApiDelay: number = 50;

  private readonly thirdPartyApiDelay: number = 3000;

  async officialApiUpdate(): Promise<void> {
    if (!this.currentId) {
      const latestIdRequest = new LatestIdRequest();
      try {
        this.currentId = await latestIdRequest.getLatestApiId();
      } catch (err) {
        this.retryUpdate(this.thirdPartyApiDelay);
        return;
      }
    }
    let response: RequestInterface.Response;
    try {
      const stashRequest = new StashApiRequest(this.currentId);
      response = await stashRequest.fetchStashes();
    } catch (err) {
      this.retryUpdate(this.officialApiDelay);
      return;
    }
    if (response.body && typeof response.body === "string") {
      const parsedData = JSON.parse(response.body);
      this.currentId = parsedData.next_change_id;
      // update demon shouldn't validate fully data - juust check if it has id
      // it's very time expensive procedure (100+ms)
    }

    this.retryUpdate(this.officialApiDelay);
  }

  retryUpdate(timeout: number): void {
    setTimeout(() => this.officialApiUpdate(), timeout);
  }
}
