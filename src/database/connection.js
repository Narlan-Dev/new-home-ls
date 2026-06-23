const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
};

const DB_NAME = process.env.DB_NAME || 'sl_db';

async function getConnection(useDb = true) {
  const config = { ...DB_CONFIG };
  if (useDb) config.database = DB_NAME;
  return mysql.createConnection(config);
}

module.exports = { getConnection, DB_NAME };
