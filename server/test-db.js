const { Client } = require('pg');
require('dotenv').config();

async function test() {
  const url = process.env.DIRECT_URL;
  console.log("Connecting to:", url.replace(/:[^:@]+@/, ':***@'));
  const client = new Client({ connectionString: url });
  
  try {
    await client.connect();
    console.log("Connected successfully!");
    const res = await client.query('SELECT NOW()');
    console.log("Query result:", res.rows[0]);
    await client.end();
  } catch (err) {
    console.error("Connection error:", err.message);
  }
}
test();
