import { Connection } from "mysql";
import disconnect from "./disconnect";

type RollbackTransaction = (connection: Connection) => Promise<void>;
type RollbackTransactionViaPromise = (connection: Connection) => Promise<void>;

const rollbackTransactionViaPromise: RollbackTransactionViaPromise = connection =>
  new Promise((resolve, reject) => {
    connection.rollback(err => {
      if (err) {
        return reject(err);
      }
      return resolve();
    });
  });

const rollbackTransaction: RollbackTransaction = async connection => {
  try {
    await rollbackTransactionViaPromise(connection);
    // eslint-disable-next-line no-empty
  } catch (err) {}
  try {
    await disconnect(connection);
    // eslint-disable-next-line no-empty
  } catch (err) {}
};

export default rollbackTransaction;
