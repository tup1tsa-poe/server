import * as moment from "moment";
import { CurrencyRequest } from "../requests/PoeNinja/CurrencyRequest";
import { CurrencyDatabase } from "../databasesApi/CurrencyDatabase";
import { Currency } from "../types";

export class CurrencyUpdater {
  public static run(): void {
    this.update();
    const sixHours = 6 * 60 * 60 * 1000;
    setInterval(CurrencyUpdater.update, sixHours);
  }

  private static async update(): Promise<boolean> {
    const dbInstance = new CurrencyDatabase();
    let list;
    try {
      list = await dbInstance.fetchLatestListFromDb();
    } catch (err) {
      return await this.fetchAndSaveList();
    }
    if (list && !this.isListOutdated(list)) {
      return true;
    }
    return await this.fetchAndSaveList();
  }

  private static async fetchAndSaveList(): Promise<boolean> {
    try {
      const request = new CurrencyRequest();
      const listFromApi: Currency.ChaosEquivalent[] = await request.fetchList();
      const db = new CurrencyDatabase();
      await db.saveListToDb({
        exchangeRates: listFromApi,
        updateTime: moment.now()
      });
    } catch (err) {
      return false;
    }
    return true;
  }

  private static isListOutdated(list: Currency.DatabaseList): boolean {
    const now = moment();
    return now.diff(list.updateTime, "hours") >= 3;
  }
}
