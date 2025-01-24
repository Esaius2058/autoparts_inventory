import { Pool } from "pg";
import config  from "../remote_db/index";

const pool = new Pool({
  user: config.user,
  password: config.password,
  host: config.host,
  port: config.port,
  database: config.database,
  ssl: config.ssl,
});

export default pool;