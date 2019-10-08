import { createConnection, format, Connection } from "mysql";

type Connect = () => Promise<Connection>;
type Disconnect = (connection: Connection) => Promise<unknown>;
type RunQueryViaPromise = (
  connection: Connection,
  query: string
) => Promise<any>;
type RunQuery = (query: string, values?: any[]) => Promise<any>;

const connect: Connect = () =>
  // eslint-disable-next-line consistent-return
  new Promise((resolve, reject) => {
    const port = process.env.DATABASE_PORT;
    if (!port) {
      return reject(new Error("databse port should be provided"));
    }
    const connection = createConnection({
      host: process.env.DATABASE_HOST,
      database: "cwhub",
      port: parseInt(port, 10),
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD
    });
    connection.connect(err => {
      if (err) {
        return reject(err);
      }
      return resolve(connection);
    });
  });

const disconnect: Disconnect = async connection =>
  new Promise((resolve, reject) => {
    // eslint-disable-next-line consistent-return
    connection.end(err => {
      if (err) {
        return reject(err);
      }
      return resolve();
    });
  });

const runQueryViaPromise: RunQueryViaPromise = (connection, query) =>
  new Promise((resolve, reject) => {
    connection.query(query, (err, results) => {
      if (err) {
        return reject(err);
      }
      return resolve(results);
    });
  });

const runQuery: RunQuery = async (query, values) => {
  const connection = await connect();
  let formattedQuery = query;
  if (values) {
    formattedQuery = format(query, values);
  }
  const result = await runQueryViaPromise(connection, formattedQuery);
  await disconnect(connection);
  return result;
};

export default runQuery;
