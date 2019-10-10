import { Connection, format } from "mysql";
import * as path from "path";
import { readFile } from "../utils";

interface MainOptions {
  readonly connection: Connection;
  readonly values?: any[];
}
interface OptionsWithFilename extends MainOptions {
  readonly filename: string;
}
interface OptionsWithInlineQuery extends MainOptions {
  readonly inlineQuery: string;
}
type QueryOptions = OptionsWithFilename | OptionsWithInlineQuery;
type RunQueryViaPromise = (options: QueryOptions) => Promise<any>;

const runQueryViaPromise: RunQueryViaPromise = async options => {
  let query: string;
  if ("filename" in options) {
    const sqlFilePath = path.join(
      __dirname,
      `../../src/database/queries/${options.filename}.sql`
    );
    query = await readFile(sqlFilePath, "utf-8");
  } else {
    query = options.inlineQuery;
  }
  let formattedQuery = query;
  if (options.values) {
    formattedQuery = format(query, options.values);
  }
  return new Promise((resolve, reject) => {
    options.connection.query(formattedQuery, (err, results) => {
      if (err) {
        return reject(err);
      }
      return resolve(results);
    });
  });
};

export default runQueryViaPromise;
