const { Router } = require('express');
const router = Router();

router.get('/login', (req, res) => res.redirect(303, 'localhost:5000'));
router.get('/authorize', (req, res) => res.redirect(303, 'localhost:5000'));
router.get('/me', (req, res) => res.status(200).end());

module.exports = router;
