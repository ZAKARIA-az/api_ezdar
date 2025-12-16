const User = require('../models/User');

class LanguageService {
  static supportedLanguages() {
    return ['en', 'ar', 'fr', 'et'];
  }

  static isSupported(language) {
    return LanguageService.supportedLanguages().includes(language);
  }

  static validateLanguage(language) {
    if (!LanguageService.isSupported(language)) {
      throw new Error('language.invalid_code');
    }
    return language;
  }

  static async updateUserLanguage(userId, language) {
    LanguageService.validateLanguage(language);

    const user = await User.findByIdAndUpdate(
      userId,
      { language },
      { new: true }
    ).select('-password');

    if (!user) {
      throw new Error('user.not_found');
    }

    return user;
  }

  static async getUserLanguage(userId) {
    const user = await User.findById(userId).select('language');
    return user ? user.language : null;
  }
}

module.exports = LanguageService;
