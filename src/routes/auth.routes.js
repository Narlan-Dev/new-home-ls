const { Router } = require('express');
const { authenticate } = require('../modules/home/auth/auth.service');

const router = Router();

router.post('/auth', async (req, res) => {
  const { name, phone } = req.body;
  if (!name || !phone) {
    return res.status(400).json({ error: 'Nome e telefone são obrigatórios.' });
  }

  try {
    const result = await authenticate({ name, phone });
    if (result.error) {
      return res.status(result.status).json({ error: result.error });
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Erro interno.' });
  }
});

module.exports = router;
