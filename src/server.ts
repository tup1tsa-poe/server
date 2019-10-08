import validateResponse from "./validators/validateOfficialApiResponse";
import StashApiRequest from "./requests/StashApiRequest";
import { OfficialApi, RequestInterface } from "./types";
import validateOfficialApiItem from "./validators/validateOfficialApiItem";
// import { itemBeautify } from "./parsers/itemBeautify";
// import ItemParser from "./parsers/ItemParser";

import GeneralResponse = OfficialApi.GeneralResponse;

async function getResponse(id: string): Promise<GeneralResponse> {
  const stashRequest = new StashApiRequest(id);
  let response: RequestInterface.Response;
  let apiResp: object;
  try {
    response = await stashRequest.fetchStashes();
    apiResp = JSON.parse(response.body);
  } catch (err) {
    throw new Error("error during download");
  }
  if (!validateResponse(apiResp)) {
    throw new Error("error during validation");
  }
  return apiResp;
}

async function fetchResponsesContinuously(
  id: string
): Promise<GeneralResponse> {
  const res = await getResponse(id);
  const items = res.stashes
    .map(stash => stash.items)
    .reduce((allItems, currentItems) => allItems.concat(currentItems), []);
  const isValid = validateOfficialApiItem(items);
  console.log(isValid);
  console.log(id);
  // const beautifiedItems = itemBeautify(items);
  // const uniqueParser = new ItemParser(items);
  // const uniqueData = uniqueParser.getAllUniqueData();
  // console.log(uniqueData);
  // save here in db
  return fetchResponsesContinuously(res.next_change_id);
}

const firstId = "504989624-521968676-493147270-563383305-535158263";
fetchResponsesContinuously(firstId);
