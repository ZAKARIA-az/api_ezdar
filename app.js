const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

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

module.exports = app;