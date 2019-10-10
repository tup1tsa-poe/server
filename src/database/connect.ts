import { createConnection, Connection } from "mysql";

type Connect = (databaseName: string | null) => Promise<Connection>;

const connect: Connect = database =>
  // eslint-disable-next-line consistent-return
  new Promise((resolve, reject) => {
    const port = process.env.DATABASE_PORT;
    if (!port) {
      return reject(new Error("databse port should be provided"));
    }
    const dbNameOptions = database ? { database } : {};
    const connection = createConnection({
      ...dbNameOptions,
      host: process.env.DATABASE_HOST,
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

export default connect;
