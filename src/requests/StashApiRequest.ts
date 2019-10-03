import { Request } from "./Request";
import { RequestInterface } from "../types";

export class StashApiRequest extends Request {
  private id: string;

  private url: string;

  private responseTimeout: number = 20000;

  constructor(id: string) {
    super();
    this.id = id;
    this.generateUrl();
  }

  public async fetchStashes(): Promise<RequestInterface.Response> {
    return this.fetchData(this.url, { timeout: this.responseTimeout });
  }

  private generateUrl(): void {
    this.url = `http://www.pathofexile.com/api/public-stash-tabs?id=${this.id}`;
  }
}
