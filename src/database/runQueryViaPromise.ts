import { Connection, format } from "mysql";

type RunQueryViaPromise = (
  connection: Connection,
  query: string,
  values?: any[]
) => Promise<any>;

const runQueryViaPromise: RunQueryViaPromise = (connection, query, values) =>
  new Promise((resolve, reject) => {
    let formattedQuery = query;
    if (values) {
      formattedQuery = format(query, values);
    }
    connection.query(formattedQuery, (err, results) => {
      if (err) {
        return reject(err);
      }
      return resolve(results);
    });
  });

export default runQueryViaPromise;
