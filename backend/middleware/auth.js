import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Token no proporcionado' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
};

export const adminMiddleware = (req, res, next) => {
  if (req.user.role !== 'admin' && req.user.role !== 'moderador') {
    return res.status(403).json({ error: 'Acceso denegado' });
  }
  next();
};
