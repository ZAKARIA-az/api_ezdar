const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const i18n = require('./config/i18n');
const i18nMiddleware = require('./middlewares/i18nMiddleware');
const authRoutes = require('./routes/authRoutes');
const languageRoutes = require('./routes/languageRoutes');
const propertyRoutes = require('./routes/propertyRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const messageRoutes = require('./routes/messageRoutes');
const cookieParser = require('cookie-parser');
const notificationRoutes = require('./routes/notificationRoutes');

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(cookieParser());

// i18n configuration
app.use(i18n.init);
app.use(i18nMiddleware);

// تحميل المودلز لتأسيس Collections
require('./models/User');
require('./models/Property');
require('./models/Favorite');
require('./models/Message');
require('./models/Notification');

// اختبار بسيط
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: req.__('common.server_running') });
});

app.use('/api/auth', authRoutes);
app.use('/api/user/language', languageRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/favorites', favoriteRoutes);
/*app.use('/api/messages', messageRoutes);*/
app.use('/api/notifications', notificationRoutes);

app.use((err, req, res, next) => {
  const msg = (err && typeof err.message === 'string') ? err.message : '';
  const isI18nKey = msg.includes('.') && !msg.includes(' ');

  let status = 500;
  if (msg === 'property.not_found' || msg === 'user.not_found' || msg === 'notifications.not_found') {
    status = 404;
  } else if (msg.startsWith('favorites.errors.') || msg === 'property.invalid_filter' || msg === 'language.invalid_code') {
    status = 400;
  } else if (msg.startsWith('auth.')) {
    status = 400;
  }

  const message = isI18nKey ? req.__(msg) : req.__('common.server_error');
  return res.status(status).json({ success: false, message });
});

module.exports = app;