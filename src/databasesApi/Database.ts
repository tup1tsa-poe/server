import { MongoClient, Collection, Db } from "mongodb";

interface CrudResult {
  error?: Error;
  data?: {}[];
}

export class Database {
  private url: string = "mongodb://192.168.0.101:27017/poe_server_test";

  private result: CrudResult;

  private internalDb: Db;

  private collectionName: string;

  constructor(collectionName: string) {
    this.collectionName = collectionName;
  }

  protected getResult(): CrudResult {
    return this.result;
  }

  protected async insert(data: object[], options: object = {}): Promise<void> {
    await this.connect();
    if (this.result.error) {
      return;
    }
    const collection: Collection = this.internalDb.collection(
      this.collectionName
    );
    try {
      await collection.insertMany(data, options);
    } catch (err) {
      this.result.error = err;
    }
    return await this.internalDb.close();
  }

  protected async read(
    queryObject: object = {},
    sortObject: object = {},
    limit: number = 100
  ): Promise<void> {
    await this.connect();
    if (this.result.error) {
      return;
    }
    const collection: Collection = this.internalDb.collection(
      this.collectionName
    );
    try {
      this.result.data = await collection
        .find(queryObject)
        .sort(sortObject)
        .limit(limit)
        .toArray();
    } catch (err) {
      this.result.error = err;
    }
    return await this.internalDb.close();
  }

  protected async update(
    query: object,
    data: object,
    upsert: boolean = false
  ): Promise<void> {
    await this.connect();
    if (this.result.error) {
      return;
    }
    const collection: Collection = this.internalDb.collection(
      this.collectionName
    );
    try {
      await collection.updateMany(query, data, { upsert });
    } catch (err) {
      this.result.error = err;
    }
    return await this.internalDb.close();
  }

  protected async delete(query: object): Promise<void> {}

  private async connect(): Promise<void> {
    this.result = {};
    try {
      this.internalDb = await MongoClient.connect(this.url);
    } catch (err) {
      this.result.error = err;
    }
  }
}
