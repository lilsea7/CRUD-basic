const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Không có quyền truy cập - Thiếu token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'User không tồn tại' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Token error:', error.message);
    return res.status(401).json({ message: 'Token không hợp lệ hoặc hết hạn' });
  }
};

module.exports = { protect };