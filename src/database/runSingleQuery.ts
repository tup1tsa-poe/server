import connect from "./connect";
import disconnect from "./disconnect";
import runQueryViaPromise from "./runQueryViaPromise";

type RunSingleQuery = (query: string, values?: any[]) => Promise<any>;

const runSingleQuery: RunSingleQuery = async (query, values) => {
  const connection = await connect("poe");
  let result: any;
  try {
    result = await runQueryViaPromise(connection, query, values);
    // eslint-disable-next-line no-empty
  } catch (err) {
    await disconnect(connection);
    throw err;
  }
  await disconnect(connection);
  return result;
};

export default runSingleQuery;
