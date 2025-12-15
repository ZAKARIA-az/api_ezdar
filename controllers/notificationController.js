const notificationService = require('../services/notificationService');

const localizeNotificationItem = (req, item) => {
  if (!item) return item;
  const plainItem = (item && typeof item.toObject === 'function') ? item.toObject() : item;
  if (!plainItem.data) return plainItem;

  const { messageKey, messageArgs, title } = plainItem.data;
  if (!messageKey) return plainItem;

  const args = Array.isArray(messageArgs)
    ? messageArgs
    : (typeof title === 'string' && title.length > 0 ? [title] : []);

  return {
    ...plainItem,
    data: {
      ...plainItem.data,
      message: args.length > 0 ? req.__(messageKey, ...args) : req.__(messageKey)
    }
  };
};

exports.getNotifications = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const result = await notificationService.getNotificationsForUser(req.user._id, { page, limit });
    if (result && result.success && Array.isArray(result.data)) {
      return res.status(200).json({
        ...result,
        data: result.data.map((n) => localizeNotificationItem(req, n))
      });
    }
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

exports.markAsRead = async (req, res, next) => {
  try {
    const result = await notificationService.markAsRead(req.user._id, req.params.id);
    if (result && result.messageKey) {
      const { messageKey, ...rest } = result;
      return res.status(200).json({ ...rest, message: req.__(messageKey) });
    }
    if (result && result.success && result.data) {
      return res.status(200).json({ ...result, data: localizeNotificationItem(req, result.data) });
    }
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

exports.markAllRead = async (req, res, next) => {
  try {
    const result = await notificationService.markAllRead(req.user._id);
    if (result && result.messageKey) {
      const { messageKey, ...rest } = result;
      return res.status(200).json({ ...rest, message: req.__(messageKey) });
    }
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

exports.deleteNotification = async (req, res, next) => {
  try {
    const result = await notificationService.deleteNotification(req.user._id, req.params.id);
    if (result && result.messageKey) {
      const { messageKey, ...rest } = result;
      return res.status(200).json({ ...rest, message: req.__(messageKey) });
    }
    if (result && result.success && result.data) {
      return res.status(200).json({ ...result, data: localizeNotificationItem(req, result.data) });
    }
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
