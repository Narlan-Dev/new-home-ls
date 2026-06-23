const { Router } = require('express');
const { getAll, selectGift, deselectGift, createGift, updateGift, deleteGift } = require('../modules/home/gifts/gifts.service');
const ROLES = require('../constants/roles.enum');

const router = Router();

router.get('/gifts', async (req, res) => {
  try {
    const gifts = await getAll();
    res.json(gifts);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar presentes.' });
  }
});

router.post('/gifts/:id/select', async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(401).json({ error: 'Usuário não autenticado.' });
  }

  try {
    const result = await selectGift(Number(req.params.id), userId);
    if (result.error) {
      return res.status(result.status).json({ error: result.error });
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao selecionar presente.' });
  }
});

router.post('/gifts/:id/deselect', async (req, res) => {
  const { userId, role } = req.body;
  if (!userId || role !== ROLES.ADMIN) {
    return res.status(403).json({ error: 'Apenas administradores podem desmarcar presentes.' });
  }

  try {
    const result = await deselectGift(Number(req.params.id));
    if (result.error) {
      return res.status(result.status).json({ error: result.error });
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao desmarcar presente.' });
  }
});

router.post('/gifts', async (req, res) => {
  const { name, category, price, description, link, image_url, userId, role } = req.body;
  if (!userId || role !== ROLES.ADMIN) {
    return res.status(403).json({ error: 'Apenas administradores podem adicionar presentes.' });
  }
  if (!name || !category || !price) {
    return res.status(400).json({ error: 'Nome, categoria e preço são obrigatórios.' });
  }

  try {
    const gift = await createGift({ name, category, description, price, link, image_url });
    res.status(201).json(gift);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao adicionar presente.' });
  }
});

router.post('/gifts/:id/update', async (req, res) => {
  const { name, category, price, description, link, image_url, role } = req.body;
  if (role !== ROLES.ADMIN) {
    return res.status(403).json({ error: 'Apenas administradores podem editar presentes.' });
  }
  if (!name || !category || !price) {
    return res.status(400).json({ error: 'Nome, categoria e preço são obrigatórios.' });
  }

  try {
    const result = await updateGift(Number(req.params.id), { name, category, description, price, link, image_url });
    if (result.error) {
      return res.status(result.status).json({ error: result.error });
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao editar presente.' });
  }
});

router.post('/gifts/:id/delete', async (req, res) => {
  const { role } = req.body;
  if (role !== ROLES.ADMIN) {
    return res.status(403).json({ error: 'Apenas administradores podem excluir presentes.' });
  }

  try {
    const result = await deleteGift(Number(req.params.id));
    if (result.error) {
      return res.status(result.status).json({ error: result.error });
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao excluir presente.' });
  }
});

module.exports = router;
