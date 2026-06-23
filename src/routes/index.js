const { Router } = require('express');

const authRoutes = require('./auth.routes');
const giftsRoutes = require('./gifts.routes');

const router = Router();

router.use(authRoutes);
router.use(giftsRoutes);

module.exports = router;
