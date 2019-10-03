import * as request from "request";
import { RequestInterface } from "../types";

export class Request {
  protected fetchData(
    url: string,
    customOptions: {} = {}
  ): Promise<RequestInterface.Response> {
    return new Promise(resolve => {
      const defaultOptions = {
        url,
        gzip: true
      };
      const callback: request.CoreOptions["callback"] = (
        error,
        response,
        body
      ) => {
        const result: RequestInterface.Response = {
          response,
          success: true,
          body: ""
        };
        if (error) {
          result.success = false;
          result.error = error;
        } else if (typeof result.body !== "string") {
          result.body = JSON.stringify(body);
        } else {
          result.body = body;
        }
        resolve(result);
      };
      request(Object.assign(defaultOptions, customOptions), callback);
    });
  }
}
