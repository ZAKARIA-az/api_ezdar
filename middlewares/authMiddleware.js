const jwt = require('jsonwebtoken');
const User = require('../models/User'); // موديل المستخدم

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>
    if (!token) return res.status(401).json({ success: false, message: 'No token provided' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET); // التحقق من صحة التوكن
    const user = await User.findById(decoded.id); // جلب بيانات المستخدم من قاعدة البيانات
    if (!user) return res.status(401).json({ success: false, message: 'Unauthorized' });

    req.user = user; // وضع بيانات المستخدم في req.user
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

module.exports = authMiddleware;
