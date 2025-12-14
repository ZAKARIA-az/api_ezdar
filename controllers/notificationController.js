const notificationService = require('../services/notificationService');

exports.getNotifications = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const result = await notificationService.getNotificationsForUser(req.user._id, { page, limit });
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

exports.markAsRead = async (req, res, next) => {
  try {
    const result = await notificationService.markAsRead(req.user._id, req.params.id);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

exports.markAllRead = async (req, res, next) => {
  try {
    const result = await notificationService.markAllRead(req.user._id);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

exports.deleteNotification = async (req, res, next) => {
  try {
    const result = await notificationService.deleteNotification(req.user._id, req.params.id);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
