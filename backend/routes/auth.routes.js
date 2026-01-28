import express from 'express';
import { login, verifyToken } from '../controllers/auth.controller.js';
import { loginLimiter } from '../middleware/rateLimiter.js';
import { body } from 'express-validator';

const router = express.Router();

// Validaciones
const loginValidation = [
  body('username').trim().notEmpty().withMessage('Username es requerido'),
  body('password').notEmpty().withMessage('Password es requerido')
];

// Rutas de autenticación
router.post('/login', loginLimiter, loginValidation, login);
router.post('/verify', verifyToken);

export default router;
