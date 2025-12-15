const i18n = require('i18n');
const path = require('path');

i18n.configure({
  locales: ['en', 'fr', 'ar', 'et'],
  defaultLocale: 'en',
  directory: path.join(__dirname, '../locales'),
  objectNotation: true,//It allows you to use nested keys in JSON.
  autoReload: true,//It is updated automatically without restarting the server.
  syncFiles: true,//If you add a new translation key in one language → it is automatically added to the other language files (with an empty value).
  queryParameter: 'lang',//It allows changing the language via the URL:
  api: {
    '__': 't',  // now req.__ becomes req.t
    '__n': 'tn' // and req.__n can be called as req.tn
  },
  register: global//Makes the translation functions available everywhere without passing req
});

module.exports = i18n;
