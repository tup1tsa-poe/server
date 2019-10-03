import { ApiValidator } from "./ApiValidator";
import { StashApiRequest } from "../requests/StashApiRequest";
import { RequestInterface } from "../types";
import { LatestIdRequest } from "../requests/PoeNinja/LatestIdRequest";

/* interface ApiDescription {
    time: string;
    changeId: string;
    exist: boolean;
} */

export class UpdateDemon {
  private currentId: string;

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
    if (
      response.body &&
      typeof response.body === "string" &&
      ApiValidator.validate(response.body)
    ) {
      const parsedData = JSON.parse(response.body);
      this.currentId = parsedData.next_change_id;
      // update demon shouldn't validate fully data - juust check if it has id
      // it's very time expensive procedure (100+ms)
      // it's ok
    } else {
      // not ok
    }

    this.retryUpdate(this.officialApiDelay);

    /* const itemsManager = new ItemsManager(this.currentId);
        let apiResponse = await itemsManager.getData();
        if (!apiResponse.success) {
            this.retryUpdate(this.officialApiDelay);
            return;
        }
        //validate here
        const validator = new ApiValidator(apiResponse.data); */

    /* if (apiResponse.data && typeof apiResponse.data === 'object' && apiResponse.data['next_change_id']) {
            const id = apiResponse.data['nex_change_id'];
            const saveFileFunc = util.promisify(fs.writeFile);
            saveFileFunc(this.officialApiSavePath + id + '.json', )
            let database = new databasesApi();
            database.write('officialApi', [apiResponse.data]);
            //currently it's writing async without worry about the result
            this.currentId = apiResponse.data['next_change_id'];
        }
        this.retryUpdate(this.officialApiDelay); */
  }

  /* async saveDescription (apiResponse) {
        return new Promise((resolve, reject) => {
            if (!apiResponse.data || typeof apiResponse.data !== 'object' || !apiResponse.data.next_change_id) {
                return reject(false);
            }
        });
    } */

  /* async getApiInfoFromDb () {
        return new Promise((resolve, reject) => {

        });
    } */

  retryUpdate(timeout: number): void {
    setTimeout(() => this.officialApiUpdate(), timeout);
  }

  logQueen(data: object) {
    /* const match = jsonData.match(regExp);
        if (match) {
            console.log(match);
        } */
  }
}
