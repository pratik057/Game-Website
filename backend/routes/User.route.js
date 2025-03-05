const UserControler = require('../controllers/userControler');
const router = require('express').Router();
router.post('/register', UserControler.registerUser);

router.post('/login', UserControler.loginUser);

module.exports = router;