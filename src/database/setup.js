const { getConnection, DB_NAME } = require('./connection');

const TABLES = [
  `CREATE TABLE IF NOT EXISTS users (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(120)   NOT NULL,
    phone       VARCHAR(20)    NOT NULL,
    role        ENUM('ADMIN', 'CLIENT') NOT NULL DEFAULT 'CLIENT',
    created_at  DATETIME       DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS gifts (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(120)   NOT NULL,
    category    VARCHAR(40)    NOT NULL,
    description VARCHAR(255)   DEFAULT NULL,
    price       DECIMAL(10,2)  NOT NULL,
    link        VARCHAR(500)   DEFAULT NULL,
    image_url   VARCHAR(500)   DEFAULT NULL,
    selected_by INT            DEFAULT NULL,
    selected_at DATETIME       DEFAULT NULL,
    created_at  DATETIME       DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME       DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (selected_by) REFERENCES users(id)
  )`,
];

async function run() {
  const conn = await getConnection(false);

  await conn.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
  await conn.query(`USE \`${DB_NAME}\``);
  console.log(`database: ${DB_NAME}`);

  for (const sql of TABLES) {
    await conn.query(sql);
    const table = sql.match(/EXISTS\s+(\w+)/)?.[1];
    console.log(`  table ok: ${table}`);
  }

  await conn.end();
  console.log('done.');
}

run().catch((e) => {
  console.error('MySQL error:', e.message);
  process.exit(1);
});
