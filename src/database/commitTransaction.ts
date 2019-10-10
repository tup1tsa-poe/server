import { Connection } from "mysql";
import disconnect from "./disconnect";

type CommitTransaction = (connection: Connection) => Promise<void>;
type CommitTransactionViaPromise = (connection: Connection) => Promise<void>;

const commitTransactionViaPromise: CommitTransactionViaPromise = connection =>
  new Promise((resolve, reject) => {
    connection.commit(err => {
      if (err) {
        return reject(err);
      }
      return resolve();
    });
  });

const commitTransaction: CommitTransaction = async connection => {
  try {
    await commitTransactionViaPromise(connection);
    // eslint-disable-next-line no-empty
  } catch (err) {}
  try {
    await disconnect(connection);
    // eslint-disable-next-line no-empty
  } catch (err) {}
};

export default commitTransaction;
