// Logger utility for auth operations

const authLogger = {
  error: (action, error) => {
    if (process.env.NODE_ENV === 'production') {
      // Production: Minimal bilgi
      console.error(`[AUTH] ${action} failed`);
    } else {
      // Development: Detaylı bilgi
      console.error(`[AUTH] ${action} failed:`, error?.message || error);
    }
  },

  info: (action, message) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[AUTH] ${action}:`, message);
    }
  }
};

module.exports = { authLogger };
