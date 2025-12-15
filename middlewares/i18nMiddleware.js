// middlewares/i18nMiddleware.js
const i18n = require('i18n');

module.exports = (req, res, next) => {
  // Make i18n functions available in request and response objects
  req.setLocale = function(locale) {
    req.locale = locale;
    i18n.setLocale(req, locale);
  };
  
  req.getLocale = function() {
    return req.locale || i18n.getLocale(req);
  };
  
  req.__ = function() {
    return i18n.__.apply(req, arguments);
  };
  
  req.__n = function() {
    return i18n.__n.apply(req, arguments);
  };
  
  // Also add to response object
  res.setLocale = req.setLocale;
  res.getLocale = req.getLocale;
  res.__ = req.__;
  res.__n = req.__n;
  
  // Set language based on user preference, cookie, or accept-language header
  const setLanguage = (lang) => {
    if (['en', 'ar', 'fr', 'et'].includes(lang)) {
      req.setLocale(lang);
      res.cookie('lang', lang, { 
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true
      });
      return true;
    }
    return false;
  };

  // Priority 1: Check URL parameter
  if (req.query.lang) {
    setLanguage(req.query.lang);
  }
  // Priority 2: Check cookie
  else if (req.cookies && req.cookies.lang) {
    setLanguage(req.cookies.lang);
  }
  // Priority 3: Use browser's accept-language header
  else if (req.headers['accept-language']) {
    const supportedLangs = ['en', 'fr', 'ar', 'et'];
    const lang = req.acceptsLanguages(supportedLangs) || 'en';
    setLanguage(lang);
  }
  
  next();
};