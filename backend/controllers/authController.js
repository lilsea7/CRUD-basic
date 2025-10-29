const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

// console.log('bcrypt loaded:', typeof bcrypt); 

const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '15m' });
};

const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
};

const signup = async (req, res) => {
  try {
    const { name, email, password, age } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email đã được sử dụng' });
    }

    const user = await User.create({ name, email, password, age });

    const verificationToken = crypto.randomBytes(32).toString('hex');
    user.verificationToken = verificationToken;
    user.verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24h
    await user.save();

    const verifyUrl = `http://localhost:5000/api/auth/verify/${verificationToken}`;

    res.status(201).json({
      message: 'Đăng ký thành công. Vui lòng xác minh tài khoản.',
      verifyUrl,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const verifyAccount = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    res.json({ message: 'Xác minh tài khoản thành công!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng' });

    if (!user.isVerified) {
      return res.status(400).json({ message: 'Tài khoản chưa được xác minh' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng' });

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();

    res.json({
      message: 'Đăng nhập thành công',
      accessToken,
      refreshToken,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const handleRefreshToken = async (req, res) => {
  console.log("REQ BODY:", req.body);

  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(401).json({ message: 'Không có token' });
    }

    const user = await User.findOne({ refreshToken });
    if (!user) {
      return res.status(403).json({ message: 'Token không hợp lệ' });
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Token hết hạn hoặc không hợp lệ' });
      }

      const newAccessToken = generateAccessToken(user._id);
      return res.json({ accessToken: newAccessToken });
    });
  } catch (error) {
    console.error('Lỗi khi làm mới token:', error);
    return res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
  }
};



const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy email' });
    }

    const otp = '1234';
    user.resetPasswordOTP = otp;
    user.resetPasswordOTPExpires = Date.now() + 10 * 60 * 1000;

    await user.save({ validateBeforeSave: false });

    console.log(`OTP for ${email}: ${otp}`);

    res.json({ 
      message: `OTP đã được gửi: ${otp} (hết hạn sau 10 phút)` 
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: error.message });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    const user = await User.findOne({
      email,
      resetPasswordOTP: otp,
      resetPasswordOTPExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'OTP không hợp lệ hoặc đã hết hạn' });
    }

    res.json({ message: 'OTP hợp lệ', email });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ message: error.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({
      email,
      resetPasswordOTP: otp,
      resetPasswordOTPExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'OTP không hợp lệ hoặc đã hết hạn' });
    }

    user.password = newPassword;
    user.resetPasswordOTP = undefined;
    user.resetPasswordOTPExpires = undefined;

    await user.save();

    res.json({ message: 'Đổi mật khẩu thành công' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: error.message });
  }
};

const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(200).json({ message: 'Đã đăng xuất' });

    await User.findOneAndUpdate({ refreshToken }, { refreshToken: null });
    res.json({ message: 'Đăng xuất thành công' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  signup,
  verifyAccount,
  signin,
  handleRefreshToken,
  forgotPassword,
  verifyOTP,
  changePassword,
  logout,
};