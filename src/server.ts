import Validator from "./validators/OfficialApiResponseValidator";
import StashApiRequest from "./requests/StashApiRequest";
import { OfficialApi, RequestInterface } from "./types";
import { OfficialApiParser } from "./parsers/OfficialApiParser";
import { itemBeautify } from "./parsers/itemBeautify";
import ItemParser from "./parsers/ItemParser";

import GeneralResponse = OfficialApi.GeneralResponse;

function checkResponse(apiResp: object): apiResp is GeneralResponse {
  return Validator.validate(apiResp);
}

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
  if (!checkResponse(apiResp)) {
    throw new Error("error during validation");
  }
  return apiResp;
}

async function fetchResponsesContinuously(
  id: string
): Promise<GeneralResponse> {
  const res = await getResponse(id);
  const parser = new OfficialApiParser(res);
  const items = parser.getAllItems();
  const beautifiedItems = itemBeautify(items);
  const uniqueParser = new ItemParser(beautifiedItems);
  const uniqueData = uniqueParser.getAllUniqueData();
  console.log(uniqueData);
  // save here in db
  return fetchResponsesContinuously(res.next_change_id);
}

const firstId = "126553920-132466241-124259500-143210747-133883517";
fetchResponsesContinuously(firstId);
