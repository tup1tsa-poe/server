import runQueryViaPromise from "./runQueryViaPromise";
import startTransaction from "./startTransaction";
import rollbackTransaction from "./rollbackTransaction";
import commitTransaction from "./commitTransaction";

interface FilenameOptions {
  readonly filename: string;
  readonly values?: any[];
}
interface InlineQueryOptions {
  readonly inlineQuery: string;
  readonly values?: any[];
}
type RunSingleQuery = (
  options: FilenameOptions | InlineQueryOptions
) => Promise<any>;

const runSingleQuery: RunSingleQuery = async options => {
  const connection = await startTransaction();
  let result: any;
  try {
    result = await runQueryViaPromise({ ...options, connection });
    // eslint-disable-next-line no-empty
  } catch (err) {
    await rollbackTransaction(connection);
    throw err;
  }
  await commitTransaction(connection);
  return result;
};

export default runSingleQuery;
