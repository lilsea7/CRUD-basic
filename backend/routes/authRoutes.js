const express = require('express');
const router = express.Router();
const {
  signup,
  verifyAccount,
  signin,
  handleRefreshToken,
  forgotPassword,
  verifyOTP,
  changePassword,
  logout,
} = require('../controllers/authController');


router.post('/signup', signup);
router.get('/verify/:token', verifyAccount);
router.post('/signin', signin);
router.post('/refresh', handleRefreshToken);
router.post('/forgot', forgotPassword);
router.post('/verify-otp', verifyOTP);
router.post('/change-password', changePassword);
router.post('/logout', logout);

module.exports = router;