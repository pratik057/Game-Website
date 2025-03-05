const UserControler = require('../controllers/userControler');
const router = require('express').Router();
const auth = require('../middleware/auth.middleware');
router.post('/register', UserControler.registerUser);

router.post('/login', UserControler.loginUser);
router.post('/send-otp', UserControler.Sendotp);
router.post('/verify-otp', UserControler.Verifyotp);

module.exports = router;