const { getConnection } = require('../../../database/connection');

async function getAll() {
  const conn = await getConnection();
  const [rows] = await conn.execute(
    `SELECT g.id, g.name, g.category, g.description, g.price, g.link, g.image_url,
            g.selected_by, u.name AS selected_by_name
     FROM gifts g
     LEFT JOIN users u ON g.selected_by = u.id
     ORDER BY g.updated_at DESC`,
  );
  await conn.end();
  return rows;
}

async function selectGift(giftId, userId) {
  const conn = await getConnection();
  const [gift] = await conn.execute('SELECT selected_by FROM gifts WHERE id = ?', [giftId]);

  if (!gift.length) {
    await conn.end();
    return { error: 'Presente não encontrado.', status: 404 };
  }

  if (gift[0].selected_by) {
    await conn.end();
    return { error: 'Este presente já foi escolhido.', status: 409 };
  }

  await conn.execute('UPDATE gifts SET selected_by = ?, selected_at = NOW() WHERE id = ?', [userId, giftId]);
  await conn.end();
  return { selected: true };
}

async function deselectGift(giftId) {
  const conn = await getConnection();
  const [gift] = await conn.execute('SELECT selected_by FROM gifts WHERE id = ?', [giftId]);

  if (!gift.length) {
    await conn.end();
    return { error: 'Presente não encontrado.', status: 404 };
  }

  if (!gift[0].selected_by) {
    await conn.end();
    return { error: 'Este presente não está selecionado.', status: 400 };
  }

  await conn.execute('UPDATE gifts SET selected_by = NULL, selected_at = NULL WHERE id = ?', [giftId]);
  await conn.end();
  return { selected: false };
}

async function createGift({ name, category, description, price, link, image_url }) {
  const conn = await getConnection();
  const [result] = await conn.execute(
    'INSERT INTO gifts (name, category, description, price, link, image_url) VALUES (?, ?, ?, ?, ?, ?)',
    [name, category, description || null, price, link || null, image_url || null],
  );
  await conn.end();
  return { id: result.insertId, name, category, description, price, link, image_url };
}

async function updateGift(giftId, { name, category, description, price, link, image_url }) {
  const conn = await getConnection();
  const [gift] = await conn.execute('SELECT id FROM gifts WHERE id = ?', [giftId]);
  if (!gift.length) {
    await conn.end();
    return { error: 'Presente não encontrado.', status: 404 };
  }

  await conn.execute(
    'UPDATE gifts SET name = ?, category = ?, description = ?, price = ?, link = ?, image_url = ? WHERE id = ?',
    [name, category, description || null, price, link || null, image_url || null, giftId],
  );
  await conn.end();
  return { id: giftId, name, category, description, price, link, image_url };
}

async function deleteGift(giftId) {
  const conn = await getConnection();
  const [gift] = await conn.execute('SELECT id FROM gifts WHERE id = ?', [giftId]);
  if (!gift.length) {
    await conn.end();
    return { error: 'Presente não encontrado.', status: 404 };
  }

  await conn.execute('DELETE FROM gifts WHERE id = ?', [giftId]);
  await conn.end();
  return { deleted: true };
}

module.exports = { getAll, selectGift, deselectGift, createGift, updateGift, deleteGift };
