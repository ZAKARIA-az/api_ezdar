const LanguageService = require('../services/languageService');

exports.updateGuestLanguage = async (req, res) => {
  try {
    const { language } = req.body;
    LanguageService.validateLanguage(language);

    if (req.setLocale) req.setLocale(language);
    res.cookie('lang', language, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true
    });

    return res.json({
      success: true,
      message: req.__('language.update_success'),
      language
    });
  } catch (error) {
    if (typeof error.message === 'string' && error.message === 'language.invalid_code') {
      return res.status(400).json({ success: false, message: req.__(error.message) });
    }
    return res.status(500).json({
      success: false,
      message: req.__('common.server_error'),
      error: error.message
    });
  }
};

exports.getGuestLanguage = async (req, res) => {
  try {
    const language = (req.getLocale && req.getLocale()) || (req.cookies && req.cookies.lang) || 'en';
    return res.json({ success: true, language });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: req.__('common.server_error'),
      error: error.message
    });
  }
};

exports.updateLanguage = async (req, res) => {
  try {
    const { language } = req.body;
    const userId = req.user.id;

    const user = await LanguageService.updateUserLanguage(userId, language);

    // Apply language for current response + store cookie (also useful for mobile/web clients)
    if (req.setLocale) req.setLocale(language);
    res.cookie('lang', language, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true
    });

    return res.json({
      success: true,
      message: req.__('language.update_success'),
      user
    });
  } catch (error) {
    if (typeof error.message === 'string' && error.message === 'language.invalid_code') {
      return res.status(400).json({ success: false, message: req.__(error.message) });
    }
    if (typeof error.message === 'string' && error.message === 'user.not_found') {
      return res.status(404).json({ success: false, message: req.__(error.message) });
    }

    return res.status(500).json({
      success: false,
      message: req.__('common.server_error'),
      error: error.message
    });
  }
};

exports.getLanguage = async (req, res) => {
  try {
    const userId = req.user.id;
    const language = (await LanguageService.getUserLanguage(userId)) || 'en';

    return res.json({
      success: true,
      language
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: req.__('common.server_error'),
      error: error.message
    });
  }
};
