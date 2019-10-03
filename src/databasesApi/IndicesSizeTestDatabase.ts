import { Database } from "./Database";

export class IndicesSizeTestDatabase extends Database {
  constructor() {
    super("hex_test");
  }

  public async update(data: object[]): Promise<void> {
    return await this.insert(data, { ordered: false });
  }

  public async updateOne(data: object): Promise<void> {
    return await this.insert([data]);
  }
}
