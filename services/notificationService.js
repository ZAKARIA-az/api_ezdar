const Notification = require('../models/Notification');

let io;

exports.setIo = (socketIo) => {
  io = socketIo;
};

exports.createNotification = async (payload) => {
  const n = await Notification.create(payload);
  if (io && payload.userId) {
    io.to(payload.userId.toString()).emit('notification', n);
  }
  return { success: true, data: n };
};

exports.getNotificationsForUser = async (userId, { page = 1, limit = 20 } = {}) => {
  const skip = (page - 1) * limit;
  const total = await Notification.countDocuments({ userId });
  const items = await Notification.find({ userId }).sort({ createdAt: -1 }).skip(skip).limit(limit);
  return { success: true, data: items, meta: { total, page, limit } };
};

exports.markAsRead = async (userId, id) => {
  const n = await Notification.findOneAndUpdate(
    { _id: id, userId },
    { isRead: true },
    { new: true }
  );
  if (!n) return { success: false, messageKey: 'notifications.not_found' };

  // تحديث المستخدم عبر Socket.IO
  if (io) {
    io.to(userId.toString()).emit('notificationRead', n);
  }

  return { success: true, data: n };
};


exports.markAllRead = async (userId) => {
  await Notification.updateMany({ userId, isRead: false }, { isRead: true });
  return { success: true, messageKey: 'notifications.all_marked_read' };
};

exports.deleteNotification = async (userId, id) => {
  const n = await Notification.findOneAndDelete({ _id: id, userId });
  if (!n) return { success: false, messageKey: 'notifications.not_found' };
  return { success: true, data: n };
};
