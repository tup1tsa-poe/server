import { Connection } from "mysql";
import connect from "./connect";

type StartTransaction = () => Promise<Connection>;

const startTransaction: StartTransaction = async () => {
  const connection = await connect("poe");
  return new Promise((resolve, reject) => {
    connection.beginTransaction(err => {
      if (err) {
        return reject(err);
      }
      return resolve(connection);
    });
  });
};

export default startTransaction;
