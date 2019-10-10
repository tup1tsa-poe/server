import { promisify } from "util";
import { readFile as readFileCallback, readdir as readdirCallback } from "fs";

export const readFile = promisify(readFileCallback);

export const readdir = promisify(readdirCallback);
