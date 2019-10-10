import { promisify } from "util";
import { config } from "dotenv";
import * as path from "path";
import { readdir as readdirCallback, readFile as readFileCallback } from "fs";
import runSingleQuery from "../database/runSingleQuery";
import connect from "../database/connect";
import runQueryViaPromise from "../database/runQueryViaPromise";
import disconnect from "../database/disconnect";
import startTransaction from "../database/startTransaction";
import commitTransaction from "../database/commitTransaction";
import rollbackTransaction from "../database/rollbackTransaction";

const readFile = promisify(readFileCallback);
const readdir = promisify(readdirCallback);

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

const checkIfDatabaseExists = async () => {
  const query = `use poe`;
  try {
    await runSingleQuery(query);
    return true;
  } catch (err) {
    return false;
  }
};

const checkIfMigrationsTableExists = async () => {
  const query = `select * from migrations`;
  try {
    await runSingleQuery(query);
    return true;
  } catch (err) {
    return false;
  }
};

const createDatabase = async () => {
  const connection = await connect(null);
  const query = `create schema poe`;
  await runQueryViaPromise(connection, query);
  return disconnect(connection);
};

const createMigrationsTable = () => {
  const query = `
    create table migrations (
        id int not null auto_increment,
        name varchar(255) not null unique,
        completed tinyint not null default 0,
        primary key (id)
    );
    `;
  return runSingleQuery(query);
};

const getAllMigrationsList: GetAllMigrationsList = async () => {
  const files = await readdir(path.resolve("./src/migrations/list"));
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
  await runSingleQuery(insertQuery, [allMigrations]);
  const selectQuery = `
  select name from migrations
  where completed = 0
  `;
  const result: { name: string }[] = await runSingleQuery(selectQuery);
  return result.map(row => row.name);
};

const runMigrations: RunMigrations = async () => {
  const isDbCreated = await checkIfDatabaseExists();
  if (!isDbCreated) {
    await createDatabase();
  }
  const isMigrationsTableCreated = await checkIfMigrationsTableExists();
  if (!isMigrationsTableCreated) {
    await createMigrationsTable();
  }
  const migrations = await getNewMigrationsList();
  if (migrations.length === 0) {
    return;
  }
  const connection = await startTransaction();
  try {
    // eslint-disable-next-line no-restricted-syntax
    for await (const migrationName of migrations) {
      const migrationPath = path.join(
        `./src/migrations/list/`,
        `${migrationName}.sql`
      );
      const query = await readFile(migrationPath, "utf-8");
      await runQueryViaPromise(connection, query);
    }
    const query = "update migrations set completed = 1";
    await runQueryViaPromise(connection, query);
  } catch (err) {
    await rollbackTransaction(connection);
    return;
  }
  await commitTransaction(connection);
};

runMigrations();
