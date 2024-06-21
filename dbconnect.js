const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

async function connect() {
  try {
    await client.connect();
    console.log('Connected to PostgreSQL database');
  } catch (error) {
    console.error('Error connecting to database:', error.message);
    throw error;
  }
}

async function createTable() {
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_actions (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR,
        action VARCHAR(50),
        details JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Table user_actions created or already exists');
  } catch (error) {
    console.error('Error creating table:', error.message);
    throw error;
  }
}

module.exports = {
  connect,
  createTable,
  client,
};
