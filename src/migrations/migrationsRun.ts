import { promisify } from "util";
import { config } from "dotenv";
import * as path from "path";
import { readdir as readdirCallback, readFile as readFileCallback } from "fs";
import runQuery, {
  connect,
  runQueryViaPromise,
  disconnect
} from "../database/utils";

const readFile = promisify(readFileCallback);
const readdir = promisify(readdirCallback);

config();

type RunMigrations = () => Promise<void>;
type GetAllMigrationsList = () => Promise<string[]>;
type GetNewMigrationsList = () => Promise<string[]>;
type MarkAllMigrationsAsCompleted = () => Promise<void>;
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
    await runQuery(query);
    return true;
  } catch (err) {
    return false;
  }
};

const checkIfMigrationsTableExists = async () => {
  const query = `select * from migrations`;
  try {
    await runQuery(query);
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
  return runQuery(query);
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
  await runQuery(insertQuery, [allMigrations]);
  const selectQuery = `
  select name from migrations 
  where completed = 0
  `;
  const result: { name: string }[] = await runQuery(selectQuery);
  return result.map(row => row.name);
};

const markAllMigrationsAsCompleted: MarkAllMigrationsAsCompleted = () => {
  const query = "update migrations set completed = 1";
  return runQuery(query);
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
  // eslint-disable-next-line no-restricted-syntax
  for await (const migrationName of migrations) {
    const migrationPath = path.join(
      `./src/migrations/list/`,
      `${migrationName}.sql`
    );
    const query = await readFile(migrationPath, "utf-8");
    await runQuery(query);
  }
  await markAllMigrationsAsCompleted();
  // todo: check this.
  // Connection may not be closed automatically so node.js is not terminated
  process.exit(0);
};

runMigrations();
