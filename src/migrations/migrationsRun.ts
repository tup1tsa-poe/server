import { config } from "dotenv";
import * as path from "path";
import runSingleQuery from "../database/runSingleQuery";
import connect from "../database/connect";
import runQueryViaPromise from "../database/runQueryViaPromise";
import disconnect from "../database/disconnect";
import startTransaction from "../database/startTransaction";
import commitTransaction from "../database/commitTransaction";
import rollbackTransaction from "../database/rollbackTransaction";
import { readdir } from "../utils";

config();

type RunMigrations = () => Promise<void>;
type GetAllMigrationsList = () => Promise<string[]>;
type GetNewMigrationsList = () => Promise<string[]>;
type GetTimestampFromName = (name: string) => number;

const getTimestampFromName: GetTimestampFromName = name => {
  const regExp = /([\d]+)\.sql/;
  const match = name.match(regExp);
  if (!match) {
    throw new Error(`can't parse filename: ${name}`);
  }
  return parseInt(match[1], 10);
};

const createDatabase = async () => {
  const connection = await connect(null);
  const inlineQuery = `create schema if not exists poe`;
  await runQueryViaPromise({ connection, inlineQuery });
  return disconnect(connection);
};

const createMigrationsTable = () => {
  const inlineQuery = `
    create table if not exists migrations (
        id int not null auto_increment,
        name varchar(255) not null unique,
        completed tinyint not null default 0,
        primary key (id)
    );
    `;
  return runSingleQuery({ inlineQuery });
};

const getAllMigrationsList: GetAllMigrationsList = async () => {
  const files = await readdir(
    path.resolve("./src/database/queries/migrations")
  );
  const allMigrationsNames = files.filter(fileName =>
    /^.+_[\d]+.sql$/.test(fileName)
  );
  return allMigrationsNames
    .sort(
      (first, second) =>
        getTimestampFromName(first) - getTimestampFromName(second)
    )
    .map(fileName => fileName.replace(/\.sql$/, ""));
};

const getNewMigrationsList: GetNewMigrationsList = async () => {
  const allMigrations = (await getAllMigrationsList()).map(migration => [
    migration
  ]);
  if (allMigrations.length === 0) {
    return [];
  }
  const insertQuery = `
    insert ignore into migrations
        (name) values ?
  `;
  await runSingleQuery({ inlineQuery: insertQuery, values: [allMigrations] });
  const selectQuery = `
  select name from migrations
  where completed = 0
  `;
  const result: { name: string }[] = await runSingleQuery({
    inlineQuery: selectQuery
  });
  return result.map(row => row.name);
};

const runMigrations: RunMigrations = async () => {
  await createDatabase();
  await createMigrationsTable();
  const migrations = await getNewMigrationsList();
  if (migrations.length === 0) {
    return;
  }
  const connection = await startTransaction();
  try {
    // eslint-disable-next-line no-restricted-syntax
    for await (const migrationName of migrations) {
      await runQueryViaPromise({
        connection,
        filename: `migrations/${migrationName}`
      });
    }
    const inlineQuery = "update migrations set completed = 1";
    await runQueryViaPromise({ connection, inlineQuery });
  } catch (err) {
    await rollbackTransaction(connection);
    return;
  }
  await commitTransaction(connection);
};

runMigrations();
