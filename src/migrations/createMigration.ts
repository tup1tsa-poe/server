import * as path from "path";
import { promisify } from "util";
import { readdir as readdirCallback, writeFile as writeFileCallback } from "fs";

const readdir = promisify(readdirCallback);
const writeFile = promisify(writeFileCallback);

if (typeof process.argv[2] !== "string") {
  throw new Error(`Migration name is not provided. 
    Syntax should be next: yarn migrations-create your-migration-name`);
}

type IsMigrationFileCreated = (name: string) => Promise<boolean>;
const isMigrationFileCreated: IsMigrationFileCreated = async name => {
  const allFiles = await readdir(path.resolve("./src/migrations/list"));
  const sqlFiles = allFiles
    .filter(fileName => /^.+_[\d]+.sql$/.test(fileName))
    .map(fileName => fileName.replace(/_[\d]+.sql$/g, ""));
  return sqlFiles.includes(name);
};

type CreateMigrationFile = (name: string) => Promise<void>;
const createMigrationFile: CreateMigrationFile = async name => {
  const isFileAlreadyCreated = await isMigrationFileCreated(name);
  if (isFileAlreadyCreated) {
    throw new Error(`file with ${name} name is already created`);
  }
  const timestamp = new Date().getTime().toString();
  const defaultText = "select 1;";
  const filePath = path.resolve(
    `./src/migrations/list/${name}_${timestamp}.sql`
  );
  return writeFile(filePath, defaultText, "utf-8");
};

createMigrationFile(process.argv[2]);
