const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const propertyRoutes = require('./routes/propertyRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const messageRoutes = require('./routes/messageRoutes');

dotenv.config();
connectDB();

const app = express();

app.use(express.json());

// تحميل المودلز لتأسيس Collections
require('./models/User');
require('./models/Property');
require('./models/Favorite');
require('./models/Message');

// اختبار بسيط
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
/*app.use('/api/favorites', favoriteRoutes);
app.use('/api/messages', messageRoutes);*/

module.exports = app;