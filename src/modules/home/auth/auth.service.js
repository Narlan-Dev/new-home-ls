const { getConnection } = require('../../../database/connection');
const ROLES = require('../../../constants/roles.enum');

async function authenticate({ name, phone }) {
  const conn = await getConnection();
  const [rows] = await conn.execute(
    'SELECT id, name, phone, role FROM users WHERE phone = ?',
    [phone],
  );

  let user;
  if (rows.length > 0) {
    user = rows[0];
    if (user.name !== name) {
      await conn.end();
      return { error: 'Nome não corresponde ao telefone cadastrado.', status: 401 };
    }
  } else {
    const [result] = await conn.execute(
      'INSERT INTO users (name, phone) VALUES (?, ?)',
      [name, phone],
    );
    user = { id: result.insertId, name, phone, role: ROLES.CLIENT };
  }

  await conn.end();
  return { user };
}

module.exports = { authenticate };
