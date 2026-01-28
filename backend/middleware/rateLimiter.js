import rateLimit from 'express-rate-limit';

// Rate limiter global
export const rateLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutos
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: {
    error: 'Demasiadas peticiones desde esta IP, por favor intenta de nuevo más tarde.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  // No almacenar la IP, solo un hash
  keyGenerator: (req) => {
    return hashIP(req.ip);
  }
});

// Rate limiter estricto para publicaciones del foro
export const foroLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutos
  max: 5, // máximo 5 publicaciones
  message: {
    error: 'Has excedido el límite de publicaciones. Espera unos minutos.'
  },
  keyGenerator: (req) => {
    return hashIP(req.ip);
  }
});

// Rate limiter para login
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    error: 'Demasiados intentos de login. Intenta de nuevo más tarde.'
  }
});

// Función para hashear IP (para no almacenarla directamente)
import crypto from 'crypto';

export const hashIP = (ip) => {
  return crypto
    .createHash('sha256')
    .update(ip + process.env.JWT_SECRET)
    .digest('hex');
};
