const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  type: { type: String, required: true, index: true },
  actorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  data: { type: mongoose.Schema.Types.Mixed },
  channel: { type: String, enum: ['email','inapp','push','sms'], default: 'inapp' },
  isRead: { type: Boolean, default: false },
  priority: { type: String, enum: ['low','medium','high'], default: 'medium' }
}, { timestamps: true });

notificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
