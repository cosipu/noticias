import express from 'express';
import {
  getAllHilos,
  getHiloById,
  createHilo,
  createRespuesta,
  deletePost,
  archivarHilo,
  bloquearIP
} from '../controllers/foro.controller.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';
import { foroLimiter } from '../middleware/rateLimiter.js';
import { body } from 'express-validator';

const router = express.Router();

// Validaciones
const hiloValidation = [
  body('titulo').trim().notEmpty().withMessage('Título es requerido')
    .isLength({ max: 255 }).withMessage('Título muy largo'),
  body('contenido').trim().notEmpty().withMessage('Contenido es requerido')
    .isLength({ max: 2000 }).withMessage('Contenido muy largo')
];

const respuestaValidation = [
  body('contenido').trim().notEmpty().withMessage('Contenido es requerido')
    .isLength({ max: 2000 }).withMessage('Contenido muy largo')
];

// Rutas públicas
router.get('/hilos', getAllHilos);
router.get('/hilos/:id', getHiloById);

// Rutas con rate limiting (para publicar)
router.post('/hilos', foroLimiter, hiloValidation, createHilo);
router.post('/hilos/:id/respuestas', foroLimiter, respuestaValidation, createRespuesta);

// Rutas de moderación (admin)
router.delete('/posts/:id', authMiddleware, adminMiddleware, deletePost);
router.patch('/hilos/:id/archivar', authMiddleware, adminMiddleware, archivarHilo);
router.post('/bloquear', authMiddleware, adminMiddleware, bloquearIP);

export default router;
