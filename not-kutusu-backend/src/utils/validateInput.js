// Input validation utility for auth operations

const validateAuth = (email, password, name = null) => {
  // Email validation
  if (!email || typeof email !== 'string' || !email.includes('@') || email.length > 100) {
    return { valid: false, message: "Geçersiz email formatı" };
  }

  // Password validation (6-128 karakter)
  if (!password || typeof password !== 'string' || password.length < 6 || password.length > 128) {
    return { valid: false, message: "Şifre 6-128 karakter arası olmalı" };
  }

  // Name validation (optional, for register)
  if (name !== null) {
    if (typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 50) {
      return { valid: false, message: "İsim 2-50 karakter arası olmalı" };
    }
  }

  return { valid: true };
};

const validatePasswordReset = (password) => {
  // Password validation for reset operations (6-128 karakter)
  if (!password || typeof password !== 'string' || password.length < 6 || password.length > 128) {
    return { valid: false, message: "Şifre 6-128 karakter arası olmalı" };
  }

  return { valid: true };
};

const validateEmail = (email) => {
  // Email validation
  if (!email || typeof email !== 'string' || !email.includes('@') || email.length > 100) {
    return { valid: false, message: "Geçersiz email formatı" };
  }

  return { valid: true };
};

module.exports = {
  validateAuth,
  validatePasswordReset,
  validateEmail
};
