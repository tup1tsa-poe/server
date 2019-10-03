import { OfficialApi } from "../types";

import Item = OfficialApi.Item;

export class OfficialApiParser {
  private response: OfficialApi.GeneralResponse;

  constructor(response: OfficialApi.GeneralResponse) {
    this.response = response;
  }

  getAllItems() {
    return this.response.stashes
      .filter(stash => {
        return stash.accountName !== null || stash.items.length > 0;
      })
      .reduce((totalItems: Item[], currentStash: OfficialApi.Stash) => {
        return totalItems.concat(currentStash.items);
      }, []);
  }
}
