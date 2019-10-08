import { config } from "dotenv";
import runQuery from "./database/utils";

config();

const query = "Select * from users";

runQuery(query).then(console.log, err => console.warn(`err is ${err}`));
