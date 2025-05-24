import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
console.log(typeof process.env.PASSWORD); // Should print "string"
console.log("Password from env:", process.env.DB_PASSWORD);
console.log("Connection string from env:", process.env.DATABASE_URL);

export default pool;
