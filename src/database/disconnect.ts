import { Connection } from "mysql";

type Disconnect = (connection: Connection) => Promise<unknown>;

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

export default disconnect;
