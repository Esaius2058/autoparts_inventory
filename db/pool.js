const { Pool } = require("pg");

if (!process.env.connectionString) {
  console.error("Error: connectionString environment variable is not set.");
  process.exit(1); // Exit the application
}

const pool = new Pool({
  connectionString: process.env.connectionString,
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

module.exports = pool;
